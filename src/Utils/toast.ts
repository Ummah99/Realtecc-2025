import { toast, ToastOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast.css';


const defaultOptions: ToastOptions = {
  position: 'top-right' as ToastPosition, 
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
  className: 'custom-toast',
};


export const showSuccessToast = (message: string) => {
  toast.success(message, defaultOptions);
};


export const showErrorToast = (message: string) => {
  toast.error(message, defaultOptions);
};


export const showInfoToast = (message: string) => {
  toast.info(message, defaultOptions);
};


export const showWarningToast = (message: string) => {
  toast.warning(message, defaultOptions);
};
