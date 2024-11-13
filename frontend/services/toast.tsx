import Toast from "react-native-toast-message";


export function toastError(msg: string) {
    Toast.show({
        type: 'error',
        text1: msg,
    });
}

export function toastSuccess(msg: string) {
    Toast.show({
        type: 'success',
        text1: msg,
    });
}