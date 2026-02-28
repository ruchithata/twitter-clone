import { useQueryClient } from "@tanstack/react-query";
import Posts from "../../components/common/Posts";

const FavoritesPage = () => {
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);

    // feedType of "favorites" will fetch `/api/posts/favorites/:id` inside Posts component
    return (
        <div className='flex-[4_4_0] border-l border-gray-700 min-h-screen'>
            <div className='p-4 border-b border-gray-700'>
                <p className='font-bold'>Favorites</p>
            </div>
            <Posts feedType="favorites" userId={authUser?._id} />
        </div>
    );
};

export default FavoritesPage;
