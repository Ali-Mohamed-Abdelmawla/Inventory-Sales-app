import Swal from 'sweetalert2';


const sweetAlertInstance = Swal.mixin({
  confirmButtonColor: '#999999',
  confirmButtonText: 'موافق',
  cancelButtonColor: '#DC2F02',
  background: "#F8F9FA",
  iconColor: "#333333",
  timer: 3000,
  timerProgressBar: true,
});

export default sweetAlertInstance;