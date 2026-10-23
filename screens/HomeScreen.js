import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MENU_ITEMS = [
  { id: '1', name: 'Greek Salad', category: 'Starters', description: 'The famous greek salad of crispy lettuce, peppers, olives and our Chicago...', price: '$12.99', emoji: '🥗' },
  { id: '2', name: 'Bruschetta', category: 'Starters', description: 'Our Bruschetta is made from grilled bread that has been smeared with garli...', price: '$7.99', emoji: '🍞' },
  { id: '3', name: 'Grilled Fish', category: 'Mains', description: 'Barbequed catch of the day, with red onion, crisp capers, chive creme fraiche...', price: '$20.00', emoji: '🐟' },
  { id: '4', name: 'Pasta', category: 'Mains', description: 'Penne with fried aubergines, tomato sauce, fresh chilli, garlic, basil & salted...', price: '$18.99', emoji: '🍝' },
  { id: '5', name: 'Lemon Dessert', category: 'Desserts', description: 'Light and fluffy traditional homemade Italian Lemon and ricotta cake.', price: '$6.99', emoji: '🍋' },
  { id: '6', name: 'Tiramisu', category: 'Desserts', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.', price: '$8.99', emoji: '🍰' },
  { id: '7', name: 'Lemonade', category: 'Drinks', description: 'Freshly squeezed lemon juice with mint and sparkling water.', price: '$4.99', emoji: '🍹' },
  { id: '8', name: 'Espresso', category: 'Drinks', description: 'Rich Italian espresso brewed fresh to order.', price: '$3.50', emoji: '☕' },
];

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        const parsed = JSON.parse(data);
        setFirstName(parsed.firstName || '');
      }
    } catch (e) {}
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuCard}>
      <View style={styles.menuCardContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>{item.price}</Text>
      </View>
      <View style={styles.menuItemImageBox}>
        <Text style={styles.menuItemEmoji}>{item.emoji}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.logoRow}>
          <Text style={styles.logoEmoji}>🍋</Text>
          <Text style={styles.logoText}>LITTLE LEMON</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{firstName ? firstName[0].toUpperCase() : '?'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderMenuItem}
        ListHeaderComponent={
          <>
            {/* Hero Section */}
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Little Lemon</Text>
                <Text style={styles.heroCity}>Chicago</Text>
                <Text style={styles.heroDesc}>
                  We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
                </Text>
              </View>
              <View style={styles.heroImageBox}>
                <Text style={styles.heroEmoji}>🥘</Text>
              </View>
            </View>

            {/* Search Bar inside hero */}
            <View style={styles.searchWrapper}>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            {/* Menu Breakdown */}
            <View style={styles.menuBreakdown}>
              <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
              >
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.divider} />
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items found for "{searchQuery}"</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerLeft: {
    width: 40,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1.2,
  },
  avatarButton: {
    padding: 2,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#F4CE14',
    fontWeight: '700',
    fontSize: 18,
  },
  hero: {
    backgroundColor: '#495E57',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#F4CE14',
    lineHeight: 34,
  },
  heroCity: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 13,
    color: '#ddd',
    lineHeight: 19,
  },
  heroImageBox: {
    width: 90,
    height: 90,
    backgroundColor: '#3d4f44',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 44,
  },
  searchWrapper: {
    backgroundColor: '#495E57',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  menuBreakdown: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#495E57',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  categoryChipTextActive: {
    color: '#F4CE14',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuCardContent: {
    flex: 1,
    paddingRight: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDesc: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#495E57',
  },
  menuItemImageBox: {
    width: 70,
    height: 70,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemEmoji: {
    fontSize: 36,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
});
