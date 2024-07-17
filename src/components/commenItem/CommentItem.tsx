import React from 'react';
import classes from './CommentItem.module.scss';
import { CommentResponse } from '../../types/comment';

interface CommentItemProps {
  commentsData: CommentResponse[];
}

const CommentItem: React.FC<CommentItemProps> = ({ commentsData }) => {

  return (
    <>
      {commentsData.slice(commentsData.length-10).map((comment: CommentResponse) => (
        <div key={comment.id} className={classes.comment_item}>
          <div className={classes.comment_item_block}>
            <img src={comment.designer.avatar} draggable="false" alt="Comment Item" className={classes.comment_item_img} />
            <h3 className={classes.comment_item_name}>{comment.designer.username}</h3>
            <span>{new Date(comment.date_created).toLocaleString()}</span>
            <span>{comment.issue}</span>
            <span>{comment.message.length > 300 ? comment.message.slice(0, 300) + '...' : comment.message}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default React.memo(CommentItem);



// import React from 'react';
// import classes from './CommentItem.module.scss';
// import { CommentResponse } from '../../types/comment.ts';
//
// interface CommentItemProps {
//  item:CommentResponse,
// }
//
// const CommentItem: React.FC<CommentItemProps> = ({ item}) => {
//   return (
//     <div className={classes.comment_item}>
//         <div className={classes.comment_item_block}>
//           <img src={item?.designer.avatar} draggable="false" alt="Comment Item" className={classes.comment_item_img} />
//           <h3 className={classes.comment_item_name}>{item.designer.username}</h3>
//           <span>{item.date_created}</span>
//           <span>{item.issue}</span>
//           <span>{item.message.length > 300 ? item.message.slice(0,300) + '...' : item.message}</span>
//           </div>
//     </div>
//   );
// };
//
// export default CommentItem;
