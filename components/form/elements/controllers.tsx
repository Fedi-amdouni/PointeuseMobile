/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useController, useFormContext } from 'react-hook-form';
import React from 'react';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export function ChoicesControl(Input: any, props: any) {
  const formContext = useFormContext();
  let controller: any;
  if (props.name && formContext)
    controller = useController({
      name: props.name || '',
      rules: {
        validate: (val: any) => {
          let res = true;
          if (props.required) {
            if (props.mode != 'radio') res = val && val.length > 0;
            else res = val != undefined && val != '';
          }
          if (props.mode != 'radio' && props.minItems && val?.length < props.minItems) res = false;
          return res;
        },
      },
      defaultValue:
        props.mode == 'radio' && !Array.isArray(props.default)
          ? props.default
          : Array.isArray(props.default)
          ? props?.default?.filter((elt: any) => (props.options as any).find((elt1: any) => elt1.value == elt || elt1 == elt))
          : [],
    });
  return <Input {...props} controller={controller} />;
}

export function InputControl(Input: any, props: any) {
  const formContext = useFormContext();
  let controller: any;
  if (props.name && formContext)
    controller = useController({
      name: props.name || '',
      rules: { required: props.required, validate: props.validate as any },
      defaultValue: !props.numberify ? props.default || '' : props.default ? 1 : 0,
    });
  return <Input {...props} controller={controller} />;
}

export function PhoneControl(Input: any, props: any) {
  const formContext = useFormContext();
  let controller: any;
  function defaultVal() {
    const deflt = props.default ? (props.default.startsWith('+') ? props.default : '+' + props.default) : '';
    let phoneParse: any = null;
    try {
      phoneParse = parsePhoneNumber(deflt);
    } catch (e) {
      /* empty */
    }
    const code = phoneParse?.countryCallingCode || props.defaultCode || '';
    const phone = phoneParse?.nationalNumber || props.default || '';
    return {
      country: phoneParse?.country,
      code: code,
      nationalNumber: phone,
      number: '+' + code + phone,
    };
  }
  if (props.name && formContext)
    controller = useController({
      name: props.name || '',
      rules: {
        validate: (val: any) => {
          if (!props.required && (!val || val?.number == '+')) return true;
          if (val.number) return isValidPhoneNumber(val.number);
          return true;
        },
      },
      defaultValue: defaultVal(),
    });
  return <Input {...props} controller={controller} />;
}

export function SelectControl(Input: any, props: any) {
  const formContext = useFormContext();
  let controller: any;
  if (props.name && formContext)
    controller = useController({
      name: props.name || '',
      rules: {
        validate: (val: any) => {
          let res = true;
          if (props.required) {
            if (props.multiple) res = val && val.length > 0 ? true : props.required;
            else res = val != undefined && val != '' ? true : props.required;
          }
          if (props.multiple && props.minItems && val?.length < props.minItems) res = false;
          return res;
        },
      },
      defaultValue:
        !props.multiple && props.default && !Array.isArray(props.default)
          ? props.default
          : Array.isArray(props.default) && props.multiple
          ? props?.default?.filter((elt: any) => (props.options as any).find((elt1: any) => elt1.value == elt || elt1 == elt))
          : !props.multiple
          ? ''
          : [],
    });
  return <Input {...props} controller={controller} />;
}
