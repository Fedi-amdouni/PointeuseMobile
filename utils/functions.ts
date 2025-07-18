import { Platform } from 'react-native';

export function capitalize(input: string) {
  if (!input || input.length === 0) {
    return '';
  }
  const firstLetter = input.charAt(0).toUpperCase();
  const restOfString = input.slice(1).toLowerCase();
  return firstLetter + restOfString;
}

export function formatPhone(input: string) {
  if (!input) return '';
  const val = input.slice(4);
  const result = [];
  for (let i = 0; i < input.length; i += 2) {
    result.push(val.slice(i, i + 2));
  }
  return input.slice(0, 4) + ' ' + result.join(' ');
}

export function formatPhoneInput(input: string) {
  if (!input) return '';
  const result = [];
  for (let i = 0; i < input.length; i += 2) {
    result.push(input.slice(i, i + 2));
  }
  return result.join(' ');
}

export async function uploadFile(image: any) {
  const form = new FormData();
  const uri = Platform.OS === 'ios' ? image.sourceURL || `file:///${image.path}` : image.path;
  form.append('photo', {
    name: image.filename || uri.split('/').pop() || `${Date.now()}.jpg`,
    type: image.mime || 'image/jpeg',
    uri: uri,
  });
  // const {data} = await axiosInstance.post('/users/update', form, {
  //   headers: {
  //     'content-type': 'multipart/form-data', // do not forget this
  //   },
  // });
}
