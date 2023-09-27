import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from './Styles';

interface Item {
  value: any;
  label: string;
}

interface Props {
  data: Item[];
  initialSelectedItem: Item | null;
  onSelectItem: (item: Item) => void;
}

const SelectionMenu: React.FC<Props> = ({
  data,
  initialSelectedItem,
  onSelectItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(
    initialSelectedItem
  );

  const handleItemPress = (item: Item) => {
    onSelectItem(item);
    setSelectedItem(item);
  };

  useEffect(() => {
    setSelectedItem(initialSelectedItem);
  }, [initialSelectedItem]);

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <TouchableOpacity
        style={[
          { width: `${100 / data.length}%` },
          styles.item,
          selectedItem?.value === item.value && styles.selectedItem,
        ]}
        onPress={() => handleItemPress(item)}
      >
        <Text
          style={[
            styles.itemText,
            selectedItem?.value === item.value && styles.selectionMenuItemText,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.selectionMenuContainer}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.value.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default SelectionMenu;
