import { StyleSheet } from 'react-native';
import appColors from './colors';
import { Size } from './utils/size';
import CheckBoxActive from './resources/assets/checkboxactive.svg';
import CheckBoxInactive from './resources/assets/checkboxinactive.svg';
const TextStyle = StyleSheet.create({
  H1: {
    fontSize: Size(23),
    fontFamily: 'Outfit-SemiBold',
    color: appColors.textGrey100,
  },
  H2: {
    fontSize: Size(21),
    fontFamily: 'Outfit-Medium',
    color: appColors.textGrey100,
  },
  legend: {
    fontSize: Size(14),
    fontFamily: 'Outfit-Regular',
    color: appColors.textGrey70,
  },
  current: {
    fontSize: Size(16),
    fontFamily: 'Outfit-Regular',
    color: appColors.textGrey70,
  },
  exergue: {
    fontSize: Size(16),
    fontFamily: 'Outfit-SemiBold',
    color: appColors.textGrey100,
  },
  label: {
    fontSize: Size(16),
    fontFamily: 'Outfit-Medium',
    color: appColors.textGrey100,
  },
});

const ButtonStyle = {
  primary: StyleSheet.create({
    initialContainer: {
      backgroundColor: appColors.primary100,
      borderRadius: 15,
      paddingHorizontal: Size(32),
      minHeight: Size(48),
      minWidth: Size(326),
      width: '100%',
      paddingVertical: Size(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    initialText: {
      color: appColors.textLight,
      lineHeight: Size(20),
      fontSize: Size(16),
      textAlign: 'center',
      fontFamily: 'Outfit-SemiBold',
    },
    touchedContainer: {
      backgroundColor: appColors.primary150,
    },
    touchedText: {
      color: appColors.textLight,
    },
    disabledContainer: {
      backgroundColor: appColors.disabled,
    },
    disabledText: {
      color: appColors.textLight,
    },
  }),
  secondary: StyleSheet.create({
    initialContainer: {
      backgroundColor: appColors.primary10,
      borderRadius: 15,
      minWidth: Size(326),
      width: '100%',
      paddingHorizontal: Size(32),
      paddingVertical: Size(12),
      minHeight: Size(48),
      alignItems: 'center',
      justifyContent: 'center',
    },
    initialText: {
      color: appColors.primary100,
      lineHeight: Size(20),
      fontSize: Size(16),
      fontFamily: 'Outfit-Medium',
    },
    touchedContainer: {
      backgroundColor: appColors.primary30,
    },
    touchedText: {
      color: appColors.primary100,
    },
    disabledContainer: {
      backgroundColor: appColors.disbaledLight,
    },
    disabledText: {
      color: appColors.disabled,
    },
  }),
  tertiary: StyleSheet.create({
    initialContainer: {
      backgroundColor: appColors.screenBackground,
      minWidth: Size(326),
      width: '100%',
    },
    initialText: {
      color: appColors.primary100,
      lineHeight: Size(20),
      fontSize: Size(16),
      fontFamily: 'Outfit-Medium',
      textDecorationLine: 'underline',
    },
    touchedContainer: {
      backgroundColor: appColors.screenBackground,
    },
    touchedText: {
      color: appColors.primary150,
    },
    disabledContainer: {
      backgroundColor: appColors.screenBackground,
    },
    disabledText: {
      color: appColors.disabled,
    },
  }),
};

const InputStyle = {
  primary: StyleSheet.create({
    container: {
      marginBottom: Size(18),
    },
    inputInitial: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Size(12),
      borderColor: appColors.textGrey10,
      borderWidth: 1.5,
      borderRadius: 16,
      minHeight: Size(54),
    },
    inputFocused: {},
    inputError: {
      borderColor: appColors.inputError,
    },
    inputSuccess: {},
    inputDisabled: {
      backgroundColor: appColors.disabledBackground,
      borderColor: appColors.disabledBorder,
    },
    inputText: {
      color: appColors.textGrey100,
      fontSize: Size(14),
      fontFamily: 'Outfit-Regular',
      flex: 1,
    },
    inputDisabledText: {
      color: appColors.disabledInputText,
      flex: 1,
    },
    inputPlaceHolderText: {
      color: appColors.disabledInputText,
      fontSize: Size(16),
      flex: 1,
    },
    labelText: { ...TextStyle.label, marginBottom: Size(5) },
    errorText: {
      ...TextStyle.legend,
      marginTop: Size(5),
      marginStart: Size(5),
      color: appColors.error,
    },
    feedBackText: {
      ...TextStyle.legend,
      marginTop: Size(5),
      color: appColors.textGrey70,
    },
  }),
};

const DropdownStyle = {
  primary: StyleSheet.create({
    container: {
      minHeight: Size(100),
      maxHeight: Size(200),
      backgroundColor: appColors.screenBackground,
      borderRadius: 16,
      borderColor: appColors.textGrey10,
      borderWidth: 1.5,
      paddingVertical: Size(7),
    },
    item: {},
    itemDisabled: {},
    itemSelected: {
      backgroundColor: appColors.primary10,
    },
  }),
};

const CheckBoxStyle = {
  primary: {
    activeIcon: CheckBoxActive,
    inactiveIcon: CheckBoxInactive,
    size: Size(22),
    style: StyleSheet.create({
      container: {
        marginBottom: Size(25),
        width: '100%',
      },
      labelText: {
        ...TextStyle.current,
        color: appColors.textGrey70,
        marginBottom: Size(5),
        marginStart: Size(4),
      },
      errorText: {
        ...TextStyle.legend,
        marginTop: Size(5),
        marginStart: Size(5),
        color: appColors.error,
      },
      successText: {
        fontWeight: 'bold',
        fontSize: Size(15),
        marginTop: Size(10),
        marginStart: Size(5),
        color: appColors.success,
      },
    }),
  },
};

export { TextStyle, ButtonStyle, InputStyle, CheckBoxStyle, DropdownStyle };
