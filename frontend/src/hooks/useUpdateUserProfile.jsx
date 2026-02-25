import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {

    const queryClient = useQueryClient();
    	const {mutateAsync:updateProfile, isPending:isUpadatingProfile} = useMutation({
		mutationFn: async(formData) => {
			try{
				const res = await fetch(`/api/users/update`, {
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				})
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.message || data.error || "Something went wrong");
				}
				return data;
			}
			catch(error){
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([

				queryClient.invalidateQueries({queryKey: ["authUser"] }),
				queryClient.invalidateQueries({queryKey: ["userProfile"] }),
			])
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

    return {updateProfile, isUpadatingProfile};
}

export default useUpdateUserProfile;