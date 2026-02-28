import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();
	
	const authUser = queryClient.getQueryData(["authUser"]) || {};
	const postOwner = post.user;

	const isLiked = post.likes?.includes(authUser?._id);
	const isFavorited = post.favorites?.includes(authUser?._id);
	const isReshared = post.reshares?.includes(authUser?._id);

	const isMyPost = authUser?._id === post.user?._id;
	const formattedDate = formatPostDate(post.createdAt);

	const {mutate:deletePost, isPending:isDeleting} = useMutation({
		mutationFn: async() => {
			try{
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
					credentials: "include",
				});

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
			toast.success("Post deleted successfully");
			// queryClient.invalidateQueries({queryKey: ["posts"]});
			queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
				if(!Array.isArray(oldData)) return oldData;
				return oldData.filter((p) => p._id !== post._id);
			});
		}
	})

	const {mutate: likePost, isPending:isLiking} = useMutation({
		mutationFn: async() => {
			try{
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
					credentials: "include",
				});
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || data.message || "Something went wrong");
				}
				return data;
			}
			catch(error){
				throw new Error(error);
			}
		},
			// 🔥 OPTIMISTIC UPDATE
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["posts"] });

			const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });

			queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
				if (!Array.isArray(oldData)) return oldData;

				return oldData.map((p) => {
					if (p._id !== post._id) return p;

					const alreadyLiked = p.likes.includes(authUser._id);

					return {
						...p,
						likes: alreadyLiked
							? p.likes.filter((id) => id !== authUser._id)
							: [...p.likes, authUser._id],
					};
				});
			});

			return { previousPosts };
		},

		// 🔥 ROLLBACK IF ERROR
		onError: (err, _, context) => {
			context?.previousPosts?.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},

		// 🔥 SYNC WITH SERVER AFTER
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		
	// 	onSuccess: (updatedLikes)=> {
	// 		toast.success("Post liked successfully");
	// 		// this is not the best UX, bc it will refetch all posts
	// 		// queryClient.invalidateQueries({queryKey: ["posts"] });

	// 		// updating the cache directly for that post
	// 		queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
	// 			if(!Array.isArray(oldData)) return oldData;

	// 			return oldData.map((p) => {
	// 				p._id === post._id ? {...p, likes:updatedLikes} : p;

	// 		// 		// if(p._id === post._id){
	// 		// 		// 	return {...p, likes:updatedLikes};
	// 		// 		// }
	// 		// 		// return p;
	// 			});
	// 		});
	// 	},
	// 	onError: (error)=> {
	// 		toast.error(error.message);
		},
	});

	const {mutate:commentPost, isPending:isCommenting} = useMutation({
		mutationFn: async() => {
			try{
				console.log("COMMENT VALUE:", comment);
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({text: comment}),
					credentials: "include",
				});
				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || data.message || "Something went wrong");
				}
				return data;
			} catch(error){
				throw new Error(error);
			}
		},
		onSuccess: (updatedComments) => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData) => {
				if(!Array.isArray(oldData)) return oldData;
				return oldData.map(p => {
					if(p._id === post._id){
						return {...p, comments:updatedComments}
					}
					return p;
				});
			});
			queryClient.invalidateQueries({queryKey: ["posts"]});
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});

	// favorite/unfavorite
	const {mutate:toggleFavorite, isPending:isTogglingFav} = useMutation({
		mutationFn: async() => {
			try{
				const res = await fetch(`/api/posts/favorite/${post._id}`, {
					method: "POST",
					credentials: "include",
				});
				const data = await res.json();
				if(!res.ok) throw new Error(data.error || data.message);
				return data;
			} catch(err){
				throw new Error(err);
			}
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["posts"] });
			const previous = queryClient.getQueriesData({ queryKey: ["posts"] });
			queryClient.setQueriesData({ queryKey: ["posts"] }, (old) => {
				if(!Array.isArray(old)) return old;
				return old.map((p) => {
					if(p._id !== post._id) return p;
					const alreadyFav = p.favorites?.includes(authUser._id);
					return {
						...p,
						favorites: alreadyFav
							? p.favorites.filter(id=>id!==authUser._id)
							: [...(p.favorites||[]), authUser._id],
					};
				});
			});
			return { previous };
		},
		onError: (err, _, context) => {
			context?.previous?.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		}
	});

	const {mutate:toggleReshare, isPending:isResharing} = useMutation({
		mutationFn: async() => {
			try{
				const res = await fetch(`/api/posts/reshare/${post._id}`, {
					method: "POST",
					credentials: "include",
				});
				const data = await res.json();
				if(!res.ok) throw new Error(data.error || data.message);
				return data;
			} catch(err){
				throw new Error(err);
			}
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["posts"] });
			const previous = queryClient.getQueriesData({ queryKey: ["posts"] });
			queryClient.setQueriesData({ queryKey: ["posts"] }, (old) => {
				if(!Array.isArray(old)) return old;
				return old.map((p) => {
					if(p._id !== post._id) return p;
					const already = p.reshares?.includes(authUser._id);
					return {
						...p,
						reshares: already
							? p.reshares.filter(id=>id!==authUser._id)
							: [...(p.reshares||[]), authUser._id],
					};
				});
			});
			return { previous };
		},
		onError: (err, _, context) => {
			context?.previous?.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		}
	});

	if(!post) return null;

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if(!comment.trim()) return;
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if(isLiking) return;
		likePost();
	};

	const handleFavoritePost = () => {
		if(isTogglingFav) return;
		toggleFavorite();
	};

	const handleResharePost = () => {
		if(isResharing) return;
		toggleReshare();
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (<FaTrash className='cursor-pointer 
								hover:text-red-500' onClick={handleDeletePost} />)}
								{isDeleting && (
									<LoadingSpinner size="sm"/>
								)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
					{post.originalPost && (
						<div className='text-sm text-gray-500 mb-1'>
							Reshared from <Link to={`/profile/${post.originalPost.user.username}`} className='font-medium'>@{post.originalPost.user.username}</Link>
						</div>
					)}
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments?.length || 0}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{!post.comments?.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
									)}
										{post.comments?.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? 
												<LoadingSpinner size='md' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleResharePost}>
								{isResharing && <LoadingSpinner size="sm" />}
								<BiRepost
									className={`w-6 h-6 ${isReshared ? "text-green-500" : "text-slate-500"} group-hover:text-green-500`}
								/>
								<span
									className={`text-sm ${isReshared ? "text-green-500" : "text-slate-500"} group-hover:text-green-500`}
								>
									{post.reshares?.length || 0}
								</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size="sm" />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<div className='cursor-pointer' onClick={handleFavoritePost}>
								{isTogglingFav && <LoadingSpinner size="sm" />}
								<FaRegBookmark
									className={`w-4 h-4 ${isFavorited ? "text-yellow-400" : "text-slate-500"}`}
								/>
							</div>
					</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;