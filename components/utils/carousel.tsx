import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import PagerView from 'react-native-pager-view';
import { Size } from '../../utils/size';
import appColors from '../../colors';

export default function Carousel(props: {
  data?: any[];
  pageCount?: number;
  initialPage?: number;
  children?: any;
  renderItem?: (item: any, index?: number) => React.JSX.Element;
  indicatorContainerStyle?: any;
  indicatorStyle?: any;
  pagerStyle?: any;
  activeIndicatorColor?: string;
  inactiveIndicatorColor?: string;
}) {
  const [page, setPage] = useState(props.initialPage || 0);
  function onPageSelected(e: any) {
    setPage(e.nativeEvent.position);
  }
  return (
    <View style={styles.containerStyle}>
      <PagerView style={{ ...styles.pagerView, ...props.pagerStyle }} initialPage={props.initialPage || 0} onPageSelected={onPageSelected}>
        {props.data && props.renderItem
          ? props.data.map((item, ind) => (
              <View style={styles.page} key={ind + ''}>
                {props?.renderItem && props?.renderItem({ item, index: ind })}
              </View>
            ))
          : props.children}
      </PagerView>
      <View
        style={{
          ...styles.indicatorContainerStyle,
          ...props.indicatorContainerStyle,
        }}
      >
        {[...Array(props.data && props.renderItem ? props.data.length : props.pageCount || 0).keys()].map((elt, ind) => (
          <Text
            key={ind}
            style={{
              ...styles.bullStyle,
              ...props.indicatorStyle,
              color: ind == page ? props.activeIndicatorColor || appColors.primary100 : props.inactiveIndicatorColor || appColors.primary30,
            }}
          >
            {'\u2B24'}
          </Text>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  containerStyle: { flex: 1 },
  pagerView: {
    flex: 15,
  },
  page: {
    flex: 1,
  },
  bullStyle: {
    marginEnd: Size(10),
    fontSize: Platform.OS == 'android' ? Size(14) : Size(8),
  },
  indicatorContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
