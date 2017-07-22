import {combineReducers} from 'redux';
import {IChannel} from '../../interfaces/IChannel';
import {IJodelAction} from '../../interfaces/IJodelAction';
import {IApiPost, IPost} from '../../interfaces/IPost';

import {PINNED_POST, RECEIVE_POSTS} from '../actions';
import {IJodelAppStore} from '../reducers';

export interface IEntitiesStore {
    posts: { [key: string]: IPost }
    channels: { [key: string]: IChannel }
}

export const entities = combineReducers({
    posts,
    channels,
});

function convertApiPostToPost(post: IApiPost): IPost {
    const newChildren = post.children !== undefined ? post.children.map(child => child.post_id) : undefined;
    return {...post, children: newChildren};
}

function posts(state: { [key: string]: IPost } = {}, action: IJodelAction): typeof state {
    if (action.payload && action.payload.entities !== undefined) {
        let newState: typeof state = {};
        action.payload.entities.forEach((post: IApiPost) => {
            post.children.forEach((child: IApiPost) => newState[child.post_id] = convertApiPostToPost(child));

            const newPost = convertApiPostToPost(post);
            const oldPost = state[post.post_id];
            if (oldPost && oldPost.children && newPost.children) {
                if (action.payload.append === true) {
                    return {
                        ...post,
                        child_count: post.child_count + oldPost.children.length,
                        children: [...oldPost.children, ...newPost.children],
                    };
                } else if (post.children.length == 0) {
                    // The old post has children and the new post has children, which however aren't included in the new data
                    // -> keep old children
                    return {...post, children: oldPost.children};
                }
            }
            newState[post.post_id] = newPost;
        });
        state = {...state, ...newState};
    }
    switch (action.type) {
    case PINNED_POST:
        return {
            ...state,
            [action.payload.postId]: {
                ...state[action.payload.postId],
                pinned: action.payload.pinned,
                pin_count: action.payload.pinCount,
            },
        };
    default:
        return state;
    }
}

function channels(state: { [key: string]: IChannel } = {}, action: IJodelAction): typeof state {
    if (action.payload && action.payload.entitiesChannels !== undefined) {
        let newState: typeof state = {};
        action.payload.entitiesChannels.forEach((channel) => {
            newState[channel.channel] = channel;
        });
        state = {
            ...state,
            ...newState,
        };
    }
    switch (action.type) {
    case RECEIVE_POSTS:
        if (action.payload.section !== undefined && action.payload.section.startsWith('channel:')) {
            let channelName = action.payload.section.substring(8);
            return {
                ...state,
                [channelName]: {
                    ...state[channelName],
                    unread: false,
                },
            };
        }
        return state;
    default:
        return state;
    }
}

export function getPost(state: IJodelAppStore, postId: string): IPost {
    return state.entities.posts[postId];
}

export function getChannel(state: IJodelAppStore, channel: string): IChannel {
    let c = state.entities.channels[channel];
    if (c === undefined) {
        return {channel};
    }
    return c;
}