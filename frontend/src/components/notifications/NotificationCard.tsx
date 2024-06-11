import { HiHeart, HiUser } from "react-icons/hi2"
import PostCard from "../posts/PostCard"
import { Notification } from "../../types/shared"

interface NotificationCardProps {
  notification: Notification
}

export default function NotificationCard({
  notification,
}: NotificationCardProps) {
  return (
    <>
      {notification.type === "reply" ? (
        notification.post && <PostCard post={notification.post} />
      ) : (
        <div className="flex flex-col border-y w-full p-2 hover:bg-gray-100">
          <div className="grid grid-cols-12 items-center gap-4">
            <div className="col-span-1">
              {notification.type === "like" && <HiHeart size={48} fill="red" />}
              {notification.type === "follow" && (
                <HiUser size={48} fill="blue" />
              )}
            </div>
            <div className="col-span-11 flex flex-col">
              <img src={notification.from.avatar} className="w-16" />
              <div className="flex">
                {notification.type === "like" &&
                  notification.contentType &&
                  notification.contentType === "post" && (
                    <span className="text-xl">
                      {notification.from.username} liked your post
                    </span>
                  )}
                {notification.type === "like" &&
                  notification.contentType &&
                  notification.contentType === "reply" && (
                    <span className="text-xl">
                      {notification.from.username} liked your reply
                    </span>
                  )}
                {notification.type === "follow" && (
                  <span className="text-xl">
                    {notification.from.username} followed you
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
