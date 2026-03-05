import { toast } from "react-toastify";

export const handleApiError = (err) => {

  if (err.response) {

    const status = err.response.status;
    const message = err.response.data?.message;

    if (status === 403) {
      toast.error("You do not have permission to perform this action");
      return;
    }

    if (status === 401) {
      toast.error("Session expired. Please login again");
      return;
    }

    toast.error(message || "Something went wrong");

  } else if (err.request) {

    toast.error("Server not responding");

  } else {

    toast.error("Unexpected error occurred");

  }

};