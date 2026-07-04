import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserLayout } from "@/components/layout/UserLayout";
import { apiCall } from "@/lib/api-config";
import { format } from "date-fns";

interface Message {
  id: number;
  title: string;
  body: string;
  sender: string;
  isRead: boolean;
  createdAt: string;
}

export default function Messages() {
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [oldMessages, setOldMessages] = useState(false);
  const { data: messages, isLoading, error, refetch } = useQuery<Message[], Error>({
    queryKey: ["myMessages"],
    queryFn: () => apiCall<Message[]>("/api/users/messages"),
    staleTime: 30_000,
  });


 const handleOldMessages = () => {
    setOldMessages((prev) => !prev);
    // if (!oldMessages) {
    //   refetch();
    // }
};

  const unreadMessages = messages?.filter((message) => !message.isRead) ?? [];
  const readMessages = messages?.filter((message) => message.isRead) ?? [];

  const handleMarkAsRead = async (messageId: number) => {
    setMarkingId(messageId);
    try {
      await apiCall<{ message: string }>(`/api/users/messages/${messageId}/read`, {
        method: "PATCH",
      });
      await refetch();
    } catch (fetchError) {
      console.error("Unable to mark message as read", fetchError);
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">View unread and read messages from the admin team.</p>
        </div>

        <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleOldMessages()}
              className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Old Messages
            </button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading messages...</div>
          ) : error ? (

            
            <div className="space-y-3">
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                {error.message || "Unable to load messages."}
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ) : !messages || messages.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-base font-medium">No messages yet.</p>
              <p className="mt-2 text-sm">Messages from the admin will appear here.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <section className={"space-y-4" +  (oldMessages ? " hidden" : "")}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">New Messages</h2>
                    <p className="text-sm text-muted-foreground">Unread messages are shown first.</p>
                  </div>
                  {unreadMessages.length > 0 && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {unreadMessages.length} new
                    </span>
                  )}
                </div>

                {unreadMessages.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-secondary p-5 text-sm text-muted-foreground">
                    You have no new messages.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {unreadMessages.map((message) => (
                      <div key={message.id} className="rounded-3xl border border-border bg-secondary p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{message.title}</p>
                            <p className="text-xs text-muted-foreground">From {message.sender}</p>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}</span>
                            <span className="rounded-full bg-secondary px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-foreground/70">
                              New
                            </span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-foreground">{message.body}</p>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(message.id)}
                            disabled={markingId === message.id}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {markingId === message.id ? "Marking..." : "Mark as read"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className={"space-y-4" +  (oldMessages ? "" : " hidden")}>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Old Messages</h2>
                  <p className="text-sm text-muted-foreground">Previously read messages are stored here.</p>
                </div>

                {readMessages.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-secondary p-5 text-sm text-muted-foreground">
                    No old messages yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {readMessages.map((message) => (
                      <div key={message.id} className="rounded-3xl border border-border bg-secondary p-5 opacity-80">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{message.title}</p>
                            <p className="text-xs text-muted-foreground">From {message.sender}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(message.createdAt), "MMM d, yyyy h:mm a")}
                          </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-foreground">{message.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
