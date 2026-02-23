import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useFollow = () => {
    
    const queryClient = useQueryClient();

    const {mutate:follow, isPending} = useMutation({
        mutationFn: async(userId) => {
            try{
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: 'POST',
                })

                // const data = await res.json();
                const text = await res.text();
                const data = text ? JSON.parse(text) : {};

                if(!res.ok){
                    throw new Error(data.message || data.error || "Something went wrong");
                }

                return data;
            } catch(error){
                throw new Error(error.message);
            }
        },
        onSuccess: (_, userId) => {
            queryClient.setQueryData(["authUser"], (oldData) => {
                if (!oldData) return oldData;

                const isFollowing = oldData.following.includes(userId);

                return {
                ...oldData,
                following: isFollowing
                    ? oldData.following.filter(id => id !== userId)
                    : [...oldData.following, userId],
                };
            });

            // queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            // Remove followed user from suggestedUsers
            queryClient.setQueryData(["suggestedUsers"], (oldData) => {
                if (!oldData) return oldData;
                return oldData.filter((user) => user._id !== userId);
            });
        },

        // onSuccess: () => {
            // Promise.all([
            //     queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
            //     queryClient.invalidateQueries({queryKey: ["authUser"]}),
            // ]);
        // },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return {follow,isPending};
};

export default useFollow;