import Swal from "sweetalert2";

const ShowAlert = (
  alertType,
  message,
  title,
  navigation,
  confirmation,
  confirmationAction
) => {
  Swal.fire({
    title: title,
    showConfirmButton: true,
    confirmButtonText: confirmation ? "Yes" : "OK",
    showCancelButton: confirmation,
    cancelButtonText: "cancel",
    cancelButtonColor: "red",
    text: message,
    icon: alertType,
  }).then((result) => {
    if (confirmation) {
      if (result.isConfirmed) {
        confirmationAction();
      }
    }

    if (navigation) {
      navigation(-1);
    }
  });
};
export default ShowAlert;
