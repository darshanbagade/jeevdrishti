import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { Card } from '@/components/ui/Card';
import { AnimalThumb } from '@/components/ui/AnimalThumb';
import { useTheme, spacing, radius } from '@/theme';
import { demoAnimals, type AnimalRecord } from '@/features/animals/demoData';
import { getAnimalCopy, formatLastSeen, type AnimalCopy } from '@/features/animals/labels';

type FilterOption = { value: string; label: string };

function FilterPills({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.filterGroup}>
      <AppText variant="caption" strong>{label}</AppText>
      <View style={styles.pills}>
        {options.map((option) => {
          const active = selected === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(option.value)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? colors.primaryStrong : colors.surface,
                  borderColor: active ? colors.primaryStrong : colors.border,
                },
              ]}
            >
              <AppText
                variant="caption"
                strong
                style={{ color: active ? colors.onStrong : colors.textMuted }}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function StatusBadge({
  status,
  copy,
}: {
  status: AnimalRecord['status'];
  copy: AnimalCopy;
}) {
  const { colors } = useTheme();
  const active = status === 'active';

  return (
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: active ? colors.primaryStrong : colors.surfaceRaised },
      ]}
    >
      <AppText
        variant="caption"
        strong
        style={{ color: active ? colors.onStrong : colors.textMuted }}
      >
        {active ? copy.active : copy.archived}
      </AppText>
    </View>
  );
}

export default function AnimalsScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const language = (i18n.resolvedLanguage ?? i18n.language).split('-')[0];
  const copy = getAnimalCopy(language);

  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [lastSeenFilter, setLastSeenFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [draftSpeciesFilter, setDraftSpeciesFilter] = useState('all');
  const [draftStatusFilter, setDraftStatusFilter] = useState('all');
  const [draftZoneFilter, setDraftZoneFilter] = useState('all');
  const [draftLastSeenFilter, setDraftLastSeenFilter] = useState('all');
  const [draftSortBy, setDraftSortBy] = useState('recent');

  const filteredAnimals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return demoAnimals
      .filter((animal) => {
        const matchesSearch =
          !query ||
          animal.id.toLowerCase().includes(query) ||
          animal.displayName?.toLowerCase().includes(query);

        const matchesSpecies =
          speciesFilter === 'all' || animal.species === speciesFilter;
        const matchesStatus =
          statusFilter === 'all' || animal.status === statusFilter;
        const matchesZone =
          zoneFilter === 'all' || animal.zone === zoneFilter;

        const matchesDate =
          lastSeenFilter === 'all' ||
          (lastSeenFilter === 'today' && animal.lastSeenDaysAgo === 0) ||
          (lastSeenFilter === '7' && animal.lastSeenDaysAgo <= 7) ||
          (lastSeenFilter === '30' && animal.lastSeenDaysAgo <= 30);

        return matchesSearch && matchesSpecies && matchesStatus && matchesZone && matchesDate;
      })
      .sort((a, b) =>
        sortBy === 'code'
          ? a.id.localeCompare(b.id)
          : a.lastSeenDaysAgo - b.lastSeenDaysAgo,
      );
  }, [search, speciesFilter, statusFilter, zoneFilter, lastSeenFilter, sortBy]);

  const speciesOptions: FilterOption[] = [
    { value: 'all', label: copy.all },
    { value: 'Tiger', label: copy.tiger },
    { value: 'Leopard', label: copy.leopard },
  ];

  const statusOptions: FilterOption[] = [
    { value: 'all', label: copy.all },
    { value: 'active', label: copy.active },
    { value: 'archived', label: copy.archived },
  ];

  const zoneOptions: FilterOption[] = [
    { value: 'all', label: copy.all },
    { value: 'core', label: copy.core },
    { value: 'buffer', label: copy.buffer },
  ];

  const dateOptions: FilterOption[] = [
    { value: 'all', label: copy.all },
    { value: 'today', label: copy.today },
    { value: '7', label: copy.last7 },
    { value: '30', label: copy.last30 },
  ];

  const clearFilters = () => {
    setSearch('');
    setSpeciesFilter('all');
    setStatusFilter('all');
    setZoneFilter('all');
    setLastSeenFilter('all');
    setSortBy('recent');
  };

  const listHeader = (
    <View style={styles.listHeader}>
      <View style={styles.header}>
        <IconButton name="back" label={copy.back} onPress={() => router.back()} />
        <AppText variant="subtitle" strong>{copy.title}</AppText>
      </View>

      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Icon name="animals" color={colors.textMuted} size={19} />
        <TextInput
          accessibilityLabel={copy.searchPlaceholder}
          value={search}
          onChangeText={setSearch}
          placeholder={copy.searchPlaceholder}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      <AppText variant="caption" muted>{copy.demoNotice}</AppText>

      <View style={styles.actionToolbar}>
        <Button
          variant={
            speciesFilter !== 'all' ||
            statusFilter !== 'all' ||
            zoneFilter !== 'all' ||
            lastSeenFilter !== 'all'
              ? 'primary'
              : 'ghost'
          }
          style={styles.toolbarButton}
          onPress={() => {
            setDraftSpeciesFilter(speciesFilter);
            setDraftStatusFilter(statusFilter);
            setDraftZoneFilter(zoneFilter);
            setDraftLastSeenFilter(lastSeenFilter);
            setFilterModalVisible(true);
          }}
        >
          {copy.filters}
        </Button>
        <Button
          variant="ghost"
          style={styles.toolbarButton}
          onPress={() => {
            setDraftSortBy(sortBy);
            setSortModalVisible(true);
          }}
        >
          {copy.sort}
        </Button>
      </View>
      <View style={styles.resultsRow}>
        <AppText variant="caption" muted>
          {copy.resultCount.replace('{count}', String(filteredAnimals.length))}
        </AppText>
        <View style={styles.viewButtons}>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            onPress={() => setViewMode('list')}
          >
            {copy.list}
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            onPress={() => setViewMode('grid')}
          >
            {copy.grid}
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer scroll={false} stripes style={styles.screen}>
      <FlatList
        key={viewMode}
        style={styles.flatList}
        data={filteredAnimals}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppText variant="title" strong>{copy.noResults}</AppText>
            <Button variant="ghost" onPress={clearFilters}>
              {copy.clearFilters}
            </Button>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            padding={spacing.sm}
            style={viewMode === 'grid' ? styles.gridCard : undefined}
            onPress={() =>
              router.push({ pathname: '/animal/[id]', params: { id: item.id } })
            }
            accessibilityLabel={`${item.id}, ${item.species}, ${item.zone}`}
          >
            <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
              <AnimalThumb size={viewMode === 'grid' ? 88 : 72} />

              <View style={viewMode === 'grid' ? styles.gridDetails : styles.listDetails}>
                <View style={styles.animalTitleRow}>
                  <AppText variant="subtitle" strong>{item.id}</AppText>
                  <StatusBadge status={item.status} copy={copy} />
                </View>

                <AppText>{item.species === 'Tiger' ? copy.tiger : copy.leopard}</AppText>

                <View style={styles.locationRow}>
                  <Icon name="location" color={colors.textMuted} size={14} />
                  <AppText variant="caption" muted>
                    {item.zone === 'core' ? copy.core : copy.buffer}
                    {' · '}
                    {formatLastSeen(item.lastSeenDaysAgo, copy)}
                  </AppText>
                </View>

                <AppText variant="caption" muted>
                  {item.sightings} · {copy.sightings}
                </AppText>
              </View>
            </View>
          </Card>
        )}
      />
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalPanel,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <AppText variant="title" strong>{copy.filters}</AppText>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FilterPills
                label={copy.speciesLabel}
                options={speciesOptions}
                selected={draftSpeciesFilter}
                onSelect={setDraftSpeciesFilter}
              />
              <FilterPills
                label={copy.statusLabel}
                options={statusOptions}
                selected={draftStatusFilter}
                onSelect={setDraftStatusFilter}
              />
              <FilterPills
                label={copy.zoneLabel}
                options={zoneOptions}
                selected={draftZoneFilter}
                onSelect={setDraftZoneFilter}
              />
              <FilterPills
                label={copy.lastSeenLabel}
                options={dateOptions}
                selected={draftLastSeenFilter}
                onSelect={setDraftLastSeenFilter}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <Button
                variant="ghost"
                style={styles.modalActionButton}
                onPress={() => setFilterModalVisible(false)}
              >
                {copy.cancel}
              </Button>
              <Button
                style={styles.modalActionButton}
                onPress={() => {
                  setSpeciesFilter(draftSpeciesFilter);
                  setStatusFilter(draftStatusFilter);
                  setZoneFilter(draftZoneFilter);
                  setLastSeenFilter(draftLastSeenFilter);
                  setFilterModalVisible(false);
                }}
              >
                {copy.apply}
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalPanel,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <AppText variant="title" strong>{copy.sort}</AppText>
            <FilterPills
              label={copy.sortBy}
              options={[
                { value: 'recent', label: copy.mostRecent },
                { value: 'code', label: copy.codeAZ },
              ]}
              selected={draftSortBy}
              onSelect={setDraftSortBy}
            />
            <View style={styles.modalActions}>
              <Button
                variant="ghost"
                style={styles.modalActionButton}
                onPress={() => setSortModalVisible(false)}
              >
                {copy.cancel}
              </Button>
              <Button
                style={styles.modalActionButton}
                onPress={() => {
                  setSortBy(draftSortBy);
                  setSortModalVisible(false);
                }}
              >
                {copy.apply}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.md, gap: 0 },
  flatList: { flex: 1 },
  listContent: { flexGrow: 1, paddingBottom: spacing.xl },
  listHeader: { gap: spacing.md, marginBottom: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  searchBox: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: spacing.sm, fontSize: 16 },
  filterGroup: { gap: spacing.xs },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  pill: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  actionToolbar: { flexDirection: 'row', gap: spacing.sm },
  toolbarButton: { flex: 1 },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    padding: spacing.sm,
  },
  modalPanel: {
    maxHeight: '82%',
    borderWidth: 1,
    borderRadius: radius.large,
    padding: spacing.md,
    gap: spacing.md,
  },
  modalScroll: { flexShrink: 1 },
  modalContent: { gap: spacing.md, paddingBottom: spacing.xs },
  modalActions: { flexDirection: 'row', gap: spacing.sm },
  modalActionButton: { flex: 1 },  sortRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  viewButtons: { flexDirection: 'row', gap: spacing.xs },
  gridRow: { gap: spacing.sm },
  gridCard: { flex: 1, minWidth: 0 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  gridItem: { alignItems: 'flex-start', gap: spacing.sm },
  listDetails: { flex: 1, minWidth: 0, gap: spacing.xs },
  gridDetails: { width: '100%', minWidth: 0, gap: spacing.xs },
  animalTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  emptyState: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
});