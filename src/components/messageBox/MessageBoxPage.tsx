import {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faCommentSlash, faReply} from '@fortawesome/free-solid-svg-icons';
import User from "../../images/user.png";
import Comment from "../../images/msg_img.png";
import "./messageBoxStyle.css";

type Usersending ={
  id: number,
  userName : string,
  message : string,
  replaySection : Comments[];
}

type Comments = {
  id_Comment : string,
  outerComments : string,
  nestedComments : string[],
}
const MessageBoxPage = () => {

  const faPropIcon = faReply  as IconProp;
  const refInput = useRef(null);
  const [userIndex, setUserIndex] = useState<Number>();
  const [hide, setHide] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userMessage, setUserMessage] = useState<string>("");
  const [firstReplayMessage, setFirstReplayMessage] = useState<string>("");
  const [userWithMessageContent, setUserWithMessageContent] = useState<Usersending[]>([]);
  const [replayCommentMsg, setReplayCommentMsg] = useState<Comments>({id_Comment : '',outerComments : '',nestedComments : []});
  const [replayNestedCommentMsg, setreplayNestedCommentMsg] = useState<string>("");

  const toggleHide = (replyIndex:Number) => {
    setUserIndex(userIndex);
    setHide(!hide);
  };
  const setUserWithMessage = () =>{    
    let isdataPresent = false;
    let alertMessage = "";
    if(userName === null || userName.length === 0) {
      isdataPresent = true;
      alertMessage += " User Name";
    }
    if(userMessage === null || userMessage.length === 0){
      isdataPresent = true;
      alertMessage += " Message";
    }
    if(isdataPresent){
      alert("Enter the"+alertMessage);
    }
    else{
      setUserWithMessageContent(prevMessage => [
        ...prevMessage,
        {
          id : userWithMessageContent.length + 1,
          userName : userName,
          message : userMessage,
          replaySection : []
        },
      ])
    }
    setUserName('');
    setUserMessage('');
  }

  const setReplyToTopMessage = (userPosition : number, userName : String, commentId : String) => {
    if((firstReplayMessage.length !== 0 && firstReplayMessage !== null) || (replayNestedCommentMsg.length !== 0 && replayNestedCommentMsg !== null)){
      setReplayCommentMsg(prevState => ({
        ...prevState,
        outerComments : firstReplayMessage,
        nestedComments : []
      }))

      if(commentId.length === 0 || commentId === null ){
        // let index = userPosition +  1;
        // userPosition = userPosition === 1 ? userPosition : index; 
        const new_data = {
          id_Comment : "",
          outerComments: firstReplayMessage,
          nestedComments : []
        };
        userWithMessageContent.map( msg => 
            {
              if(msg.id === userPosition && msg.userName === userName){
                let index = msg.replaySection.length + 1;
                new_data.id_Comment = index.toString()+"_"+userPosition.toString()+"_Reply";
                let arrayData = msg.replaySection.push(new_data)
                return {...msg, replaySection : arrayData};
              }
            } 
          )
      }
      else{
        const new_replyMsg = replayNestedCommentMsg;
        userWithMessageContent.map( msg => 
          {
            if(msg.id === userPosition && msg.userName === userName){
              msg.replaySection.map( reply => {
                if(reply.id_Comment === commentId){
                  let nestedCmds = reply.nestedComments.push(new_replyMsg)
                  return {...reply, nestedComments : nestedCmds};
                }
              }
              )
            }
          } 
        )
      }
      // setUserWithMessageContent(prevMessage =>
      //   prevMessage.filter(isContentPresent => {
      //       if(isContentPresent.id === userPosition && isContentPresent.userName == userName){
      //          if(replayCommentMsg.outerComments.length !== 0){
      //            let arrayData = isContentPresent.replaySection.push(new_data)
      //            return {...isContentPresent, replaySection : arrayData};
      //          }
      //     }
      //     return isContentPresent;
      //   }),
      // );
    }
    setFirstReplayMessage('');
    setreplayNestedCommentMsg('');
  }

  useEffect(()=>{
  },[userWithMessageContent])

  return (
    <div className="container">
      <div className="messagebox m-3 p-3 d-flex justify-content-center">
        <div className="messagebox-content">
          <div className="messagebox-header p-2">
            <h1 className="text-center">Messager</h1>
          </div>
          <div className="messagebox-body p-3">
          {
            userWithMessageContent.map((data,index) => {
              let replayIdValue = "topUserIndex_"+index.toString();
              let commentsIdValue = "commentIndex_"+index.toString();
              return(
                <div key={index} className="message-top-level">
                  <div className="message-section m-2 p-3">
                    <div className="user-content d-flex flex-row pb-2">
                      <img  src={User}  alt="#user_image"  width="50px"  height="50px"/>
                      <div className="user-message d-flex flex-column">
                        <h3 className="m-0">{data.userName}</h3>
                        <p className="m-0">{data.message}</p>
                        <div className="d-flex justify-content-between">
                          <button data-bs-toggle="collapse" data-bs-target={"#"+replayIdValue} aria-expanded="false" aria-controls={replayIdValue}>Replay</button>          
                        </div>
                      </div>
                    </div>
                    <div className="collapse" id={replayIdValue}>
                      <div className="d-flex user-replay-inputs justify-content-start">
                        <input type="text" ref={refInput} value={firstReplayMessage} onChange={e => setFirstReplayMessage(e.target.value)} placeholder="Replay Message" required />
                        <button onClick={()=>setReplyToTopMessage(data.id, data.userName, '')}>Replay</button>
                      </div>
                    </div>
                    <div className="collapse" id={replayIdValue}>
                    {
                      data.replaySection !== null && data.replaySection.length !== 0 ?
                      (
                        <div className="comments-section mt-2">
                          {data.replaySection.map( (replayData,index) => {
                            let idInnerValue = replayIdValue+"InnerIndex_"+index.toString();
                            return(
                              <div id={replayData.id_Comment.toString()} className="replay-comments d-flex flex-column justify-content-start p-2">
                                <div className="replayed-msg-comments">
                                  <span className="d-flex">
                                    <img className="mt-1" src={Comment} alt=""/>
                                    <p className="ml-2">{replayData.outerComments}</p>
                                  </span> 
                                  <button  data-bs-toggle="collapse" data-bs-target={"#"+idInnerValue} aria-expanded="false" aria-controls={idInnerValue}>replay</button>
                                </div>
                                <div  className="collapse" id={idInnerValue}>
                                  <div className="comments-replay-inputs d-flex justify-content-start">  
                                    <input type="text" onChange={e => setreplayNestedCommentMsg(e.target.value)} required />
                                    <button className="comments-replay-button" onClick={() => setReplyToTopMessage(data.id, data.userName,replayData.id_Comment)}><FontAwesomeIcon icon={faPropIcon}  /></button>
                                  </div>
                                </div>
                                <div>
                                {
                                  replayData.nestedComments !== null  && replayData.nestedComments.length !== 0 ?
                                  (
                                  <div>
                                    {
                                    replayData.nestedComments.map( comments => {
                                      return(
                                        <p className="text-start pr-4">{comments}</p>
                                      )
                                    })
                                  }
                                  </div>
                                  )
                                  :
                                  (null)
                                }
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      ):
                      (<div className="comments-section mt-2 text-left">
                          <div>
                            <p>No comments</p>
                          </div>
                      </div>) 
                    }
                    </div>          
                  </div>
                </div>
              )
            })
          }
          </div>
          <div className="messagebox-footer d-flex flex-row justify-content-center">
            <input className="username-input" type="text" placeholder="UserName" value={userName} onChange={e => setUserName(e.target.value)} required/>
            <input className="message-input" type="text" placeholder="Message" value={userMessage} onChange={e => setUserMessage(e.target.value)} required/>
            <button className="msg-send-button" onClick={setUserWithMessage}>Send</button>
          </div>
        </div>
      </div>
      {/* <p>
  <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
    Toggle width collapse
  </button>
</p>
<div style={{minHeight: "120px"}}>
  <div className="collapse collapse-horizontal" id="collapseWidthExample">
    <div className="card card-body" style={{width: "300px"}}>
      This is some placeholder content for a horizontal collapse. It's hidden by default and shown when triggered.
    </div>
  </div>
</div> */}
    </div>
  );
};

export default MessageBoxPage;
