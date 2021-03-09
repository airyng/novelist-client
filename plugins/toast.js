import Swal from 'sweetalert'

export const ErrorMessage = (title = 'Ошибка!', text = '') => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    toast: true,
    timer: 5000,
    position: 'bottom',
    timerProgressBar: true,
    showConfirmButton: false
  })
}

export const SuccessMessage = (title = 'Готово!', text = '') => {
  Swal.fire({
    title,
    text,
    icon: 'success',
    toast: true,
    timer: 5000,
    position: 'bottom',
    timerProgressBar: true,
    showConfirmButton: false
  })
}
