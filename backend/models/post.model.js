import { model, Schema } from 'mongoose';

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    img: {
        type: String
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    reshares: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    originalPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
}, {timestamps: true});

const Post = model('Post', postSchema);
export default Post;