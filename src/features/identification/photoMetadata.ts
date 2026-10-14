import * as Location from 'expo-location';

export type PhotoLocation = {
  latitude: number;
  longitude: number;
  accuracyMeters: number | null;
};

export type PhotoCaptureMetadata = {
  capturedAt: string | null;
  captureTimeSource: 'photo-exif' | 'camera-return-time' | 'unknown';
  location: PhotoLocation | null;
  locationSource:
    | 'photo-exif'
    | 'device-gps-after-capture'
    | 'unknown';
};

type ExifRecord = Record<string, unknown>;

function exifNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const text = value.trim();

    if (text.includes('/')) {
      const parts = text.split('/');
      if (parts.length === 2) {
        const numerator = Number(parts[0]);
        const denominator = Number(parts[1]);
        if (
          Number.isFinite(numerator) &&
          Number.isFinite(denominator) &&
          denominator !== 0
        ) {
          return numerator / denominator;
        }
      }
    }

    const parsed = Number(text);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (typeof value === 'object' && value !== null) {
    const item = value as Record<string, unknown>;
    if ('numerator' in item && 'denominator' in item) {
      const numerator = exifNumber(item.numerator);
      const denominator = exifNumber(item.denominator);

      if (
        numerator !== null &&
        denominator !== null &&
        denominator !== 0
      ) {
        return numerator / denominator;
      }
    }
  }

  return null;
}

function decimalCoordinate(value: unknown, reference: unknown): number | null {
  let result: number | null;

  if (Array.isArray(value)) {
    const parts = value.map(exifNumber);
    if (
      parts.length < 3 ||
      parts.slice(0, 3).some((part) => part === null)
    ) {
      return null;
    }

    result =
      Math.abs(parts[0]!) +
      Math.abs(parts[1]!) / 60 +
      Math.abs(parts[2]!) / 3600;
  } else if (typeof value === 'string' && /[,;]/.test(value)) {
    const parts = value.split(/[,;]/).map(exifNumber);
    if (
      parts.length < 3 ||
      parts.slice(0, 3).some((part) => part === null)
    ) {
      return null;
    }

    result =
      Math.abs(parts[0]!) +
      Math.abs(parts[1]!) / 60 +
      Math.abs(parts[2]!) / 3600;
  } else {
    result = exifNumber(value);
  }

  if (result === null) return null;

  const direction = String(reference ?? '').toUpperCase();
  if (direction === 'S' || direction === 'W') {
    result = -Math.abs(result);
  }

  return Number.isFinite(result) ? result : null;
}

function captureTimestamp(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  const text = value.trim();
  const exifDate = text.match(
    /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/,
  );

  if (exifDate) {
    // EXIF commonly stores local camera time without a timezone.
    // Keep it timezone-unspecified rather than inventing UTC.
    return `${exifDate[1]}-${exifDate[2]}-${exifDate[3]}T${exifDate[4]}:${exifDate[5]}:${exifDate[6]}`;
  }

  const parsed = Date.parse(text);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

export function extractPhotoCaptureMetadata(
  exif: ExifRecord | null | undefined,
): PhotoCaptureMetadata {
  if (!exif) {
    return {
      capturedAt: null,
      captureTimeSource: 'unknown',
      location: null,
      locationSource: 'unknown',
    };
  }

  const nestedGps =
    typeof exif.GPS === 'object' && exif.GPS !== null
      ? (exif.GPS as ExifRecord)
      : {};

  const gps = { ...exif, ...nestedGps };
  const latitude = decimalCoordinate(
    gps.GPSLatitude ?? gps.Latitude,
    gps.GPSLatitudeRef ?? gps.LatitudeRef,
  );
  const longitude = decimalCoordinate(
    gps.GPSLongitude ?? gps.Longitude,
    gps.GPSLongitudeRef ?? gps.LongitudeRef,
  );

  const validLocation =
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const capturedAt = captureTimestamp(
    exif.DateTimeOriginal ?? exif.DateTimeDigitized ?? exif.DateTime,
  );

  return {
    capturedAt,
    captureTimeSource: capturedAt ? 'photo-exif' : 'unknown',
    location: validLocation
      ? { latitude: latitude!, longitude: longitude!, accuracyMeters: null }
      : null,
    locationSource: validLocation ? 'photo-exif' : 'unknown',
  };
}

export async function createCameraPhotoMetadata(
  exif: ExifRecord | null | undefined,
  canUseDeviceLocation: boolean,
): Promise<PhotoCaptureMetadata> {
  const cameraReturnTime = new Date().toISOString();
  const photoMetadata = extractPhotoCaptureMetadata(exif);

  let location = photoMetadata.location;
  let locationSource = photoMetadata.locationSource;

  // Prefer GPS embedded in the captured photo. Otherwise, use a fresh
  // device location obtained immediately after the camera returns.
  if (!location && canUseDeviceLocation) {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracyMeters: position.coords.accuracy,
      };
      locationSource = 'device-gps-after-capture';
    } catch {
      // Keep location unknown if the device cannot obtain a fix.
    }
  }

  return {
    capturedAt: photoMetadata.capturedAt ?? cameraReturnTime,
    captureTimeSource: photoMetadata.capturedAt
      ? 'photo-exif'
      : 'camera-return-time',
    location,
    locationSource,
  };
}