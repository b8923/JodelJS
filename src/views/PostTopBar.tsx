import classnames from 'classnames';
import React from 'react';
import {connect} from 'react-redux';
import {IPost} from '../interfaces/IPost';
import {JodelThunkDispatch} from '../interfaces/JodelThunkAction';
import {pin} from '../redux/actions';
import {ojFilterPost, sharePost} from '../redux/actions/api';
import {IJodelAppStore} from '../redux/reducers';
import {getSelectedPost} from '../redux/selectors/posts';
import BackButton from './BackButton';

export interface IPostTopBarProps {
}

export interface IPostTopBarComponentProps extends IPostTopBarProps {
    post: IPost | null;
    onBackClick: () => void;
    onPinClick: () => void;
    onShareClick: () => void;
    onOjFilterClick: () => void;
}

const PostTopBarComponent = (props: IPostTopBarComponentProps) => {
    const {onBackClick, onOjFilterClick, onPinClick, onShareClick, post} = props;
    if (!post) {
        return null;
    }
    const pinned = post.pinned && post.pinned;
    return (
        <div className="postTopBar">
            <BackButton onClick={onBackClick}/>
            <div className="rightButtons">
                {post.shareable && post.shareable ?
                    <div className="share">
                        {post.share_count && post.share_count > 0 ? post.share_count : ''}
                        <div className="shareButton" onClick={onShareClick}>
                        </div>
                    </div>
                    : ''}
                <div className="oj-filter">
                    <div className={classnames('oj-filter-button', {'oj-filtered': post.oj_filtered})}
                         onClick={onOjFilterClick}>
                    </div>
                </div>
                <div className="pin">
                    {post.pin_count && post.pin_count > 0 ? post.pin_count : ''}
                    <div className={classnames('pinButton', {pinned})} onClick={onPinClick}>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IJodelAppStore, ownProps: IPostTopBarProps): Partial<IPostTopBarComponentProps> => {
    return {
        post: getSelectedPost(state),
    };
};

const mapDispatchToProps = (dispatch: JodelThunkDispatch, ownProps: IPostTopBarComponentProps) => {
    return {
        onBackClick: () => {
            window.history.back();
        },
        onOjFilterClick: () => {
            if (!ownProps.post) {
                return;
            }
            dispatch(ojFilterPost(ownProps.post.post_id, !ownProps.post.oj_filtered));
        },
        onPinClick: () => {
            if (!ownProps.post) {
                return;
            }
            const isPinned = ownProps.post.pinned && ownProps.post.pinned;
            dispatch(pin(ownProps.post.post_id, !isPinned));
        },
        onShareClick: () => {
            if (!ownProps.post) {
                return;
            }
            dispatch(sharePost(ownProps.post.post_id));
        },
    };
};

export const PostTopBar = connect(mapStateToProps)(connect(() => ({}), mapDispatchToProps)(PostTopBarComponent));
