import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import {RoomState} from "store/roomState";

const Chat = (props) => {
  const [target,] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room] = useRecoilState(RoomState);

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(message) {
      let _target = [];
      if(target) {
        _target.push(target);
      }
      room.sendUserMessage(_target, message, 'web');
      setMessages((oldMessages)=>{
        return [...oldMessages, {
          senderId: '나',
          message: message
        }]
      });

      setMessage('');
    }
  };

  useEffect(()=>{
    if(room) {
      room.on('userMessage', (e)=>{
        setMessages((oldMessages)=>{
          return [...oldMessages, {
            senderId: e.senderId,
            message: e.message
          }]
        });
      });
    }
  }, [room]);

  return (
      <aside class="chat-container">
        <ul className="message-container">
          {
            messages.map((item, i)=>{
              return (
                  <li key={i}>
                    <span className='decoration-sky-500/30 mr-1.5'>{item.senderId}: </span>
                    <span>{item.message}</span>
                  </li>
              );
            })
          }
        </ul>
        <form onSubmit={handleSubmit}>
          <div>
            <select name='forUser'>
              <option value='' selected>전체</option>
              {
                room.remoteParticipants.map((participant, i) => {
                  return (<option value={participant.id}>{participant.id}</option>);
                })
              }
            </select>
            <input
                className="massage-input"
                type='text'
                placeholder='input message'
                value={message}
                onChange={(e)=>{ setMessage(e.target.value); }}
                required
            />
          </div>
        </form>
      </aside>
  );
};

export default Chat;

