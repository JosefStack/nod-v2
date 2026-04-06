import { useAuthStore } from "@/store/useAuthStore"
import type { Message } from "@/types/chat";


const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays === 0) return "Today";
  return date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


interface Props {
  message: Message;
  showDateLabel: boolean;
}

const AttachmentsGrid = ({ attachments, isMe }: { attachments: Message["attachments"]; isMe: boolean }) => {
  const images = attachments.filter((att) => att.type === "image");
  const videos = attachments.filter((att) => att.type === "video");
  const files = attachments.filter((att) => att.type !== "video" && att.type !== "image");

  return (
    <div className="space-y-1">
      {
        [...images, ...videos].length > 0 && (
          <div className={
            `grid gap-1 rounded-xl overflow-hidden 
            ${[...images, ...videos].length === 1 ? "grid-cols-1 max-w-xs" :
              [...images, ...videos].length >= 2 ? "grid-cols-2" :
                ""
            }`
          }>
            {
              [...images, ...videos].map((att, index) => {
                const isLast = index === [...images, ...videos].length - 1;
                const isOdd = [...images, ...videos].length % 2 !== 0;
                const spanFull = isLast && isOdd;

                return (
                  <div
                    key={att.id}
                    className={`
                        relative overflow-hidden 
                        ${spanFull ? "col-span-2" : ""}
                      `}
                  >
                    {
                      att.type === "image" ? (
                        <img
                          src={att.url}
                          alt="attachment"
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      ) : (
                        <video
                          src={att.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )
                    }

                  </div>
                )
              })
            }
          </div>
        )
      }

      {
        files.map(file => {
          return <a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className={`
              flex items-center gap-3 p-3 rounded-xl transition-colors
              ${isMe ? "bg-violet-600/50 hover:bg-violet-600/70" : "bg-gray-700/50 hover:bg-gray-700/70"}
              `}
          >
            <div className="w-9 h-9 rounded-lg bg-gray-600 flex items-center justify-center text-lg shrink-0">
              📄
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{file.fileName || "File"}</p>
              {file.size && (
                <p className="text-gray-400 text-[10px]">
                  {(parseInt(file.size) / 1024 / 1024).toFixed(1)} MB
                </p>
              )}
            </div>
            <div className="ml-5 flex items-center justify-center bg-gray-600 rounded-full w-8 h-8">
              <span className="text-white text-xs">↓</span>
            </div>

          </a>
        })
      }
    </div>
  )
}

const MessageBubble = ({ message, showDateLabel }: Props) => {

  const { user } = useAuthStore();
  const isMe = user?.id === message.senderId;
  const hasText = !!message.content;
  const hasAttachment = message.attachments.length > 0;

  return (
    <div>
      {/* date label */}
      {showDateLabel && (
        <div className="flex items-center justify-center my-5">
          <span className="text-[11px] text-gray-400 bg-[#18191d] px-3 py-1 rounded-full tracking-wide">
            {formatDateLabel(message.createdAt)}
          </span>
        </div>
      )}

      <div className={`flex items-end gap-2 mb-1
        ${isMe ? "flex-row-reverse" : "flex-row"}`}>

        {/* avatar - only for other user */}
        {!isMe && (
          <div className="w-8 h-8 rounded-full bg-[#24262a] flex items-center justify-center 
  text-gray-400 text-xs font-bold shirnk-0 overflow-hidden">
            {message.sender.avatar
              ? <img src={message.sender.avatar} alt={message.sender.username} className="w-full h-full object-cover" />
              : message.sender.username?.[0]?.toUpperCase()
            }
          </div>
        )}

        {/* name, text, attachments */}
        <div className={`flex flex-col gap-1 max-w-[70%] lg:max-w-[55%] 
          ${isMe ? "items-end" : "items-start"}`}>

          {!isMe && (
            <span className="text-[11px] text-gray-400 px-1">
              {message.sender.name || message.sender.username}
            </span>
          )}

          {hasAttachment && (
            <AttachmentsGrid attachments={message.attachments} isMe={isMe} />
          )}

          {hasText && (
            <div className={
              `px-4 py-2.5 rounded-full text-sm leading-none wrap-break-words 
            ${isMe ?
                "bg-violet-500 text-white rounded-br-none" :
                "bg-[#1e2023] text-gray-100 rounded-bl-none"
              } 
            `}>
              {message.content}
            </div>
          )}

          {/* timestamp and read receipts */}
          <div className={`flex items-center gap-1 px-1 
            ${isMe ? "flex-row-reverse" : ""}`}>
            <span className="text-[10px] text-gray-500">
              {formatTime(message.createdAt)}
            </span>
            <span className={`text-[10px] 
              ${message.readBy.length > 0 ? "text-violet-400" : " text-gray-500"}`}>
              {message.readBy.length > 0 ? "✓✓" : "✓"}
            </span>
          </div>

        </div>

      </div>


    </div>
  )
}

export default MessageBubble
