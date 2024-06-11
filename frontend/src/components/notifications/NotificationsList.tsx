import { Notification } from "../../types/shared"
import NotificationCard from "./NotificationCard"

interface NotificationsListProps {
  notifications: Notification[]
}

export default function NotificationsList({
  notifications,
}: NotificationsListProps) {
  return (
    <div className="w-full h-screen">
      {notifications &&
        notifications.map((notification: Notification, i: any) => (
          <div
            className="flex gap-2 hover:cursor-pointer hover:bg-gray-100 transition z-10"
            key={i}
          >
            <NotificationCard notification={notification} />
          </div>
        ))}
    </div>
  )
}
