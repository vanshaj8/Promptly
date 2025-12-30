'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { commentsAPI, Comment, Reply } from '@/lib/api';

export default function InboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [selectedCommentReplies, setSelectedCommentReplies] = useState<Reply[]>([]);
  const [statusFilter, setStatusFilter] = useState<'OPEN' | 'REPLIED' | undefined>(
    (searchParams.get('status') as 'OPEN' | 'REPLIED') || undefined
  );
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    loadComments();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedComment) {
      loadCommentDetails(selectedComment.id);
    }
  }, [selectedComment]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsAPI.getAll(statusFilter);
      setComments(data.comments);
      
      // Auto-select first comment if available and none selected
      if (data.comments.length > 0 && !selectedComment) {
        setSelectedComment(data.comments[0]);
      } else if (data.comments.length === 0) {
        setSelectedComment(null);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommentDetails = async (commentId: number) => {
    try {
      const data = await commentsAPI.getOne(commentId);
      setSelectedCommentReplies(data.replies || []);
    } catch (error) {
      console.error('Failed to load comment details:', error);
    }
  };

  const handleReply = async () => {
    if (!selectedComment || !replyText.trim()) return;

    try {
      setReplying(true);
      await commentsAPI.reply(selectedComment.id, replyText);
      setReplyText('');
      setSelectedCommentReplies([]);
      await loadComments();
      // Reload selected comment details
      await loadCommentDetails(selectedComment.id);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Panel: Comment List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Header with Filters */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
              <button
                onClick={loadComments}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Refresh
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter(undefined)}
                className={`px-3 py-1 text-sm rounded-md ${
                  statusFilter === undefined
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('OPEN')}
                className={`px-3 py-1 text-sm rounded-md ${
                  statusFilter === 'OPEN'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setStatusFilter('REPLIED')}
                className={`px-3 py-1 text-sm rounded-md ${
                  statusFilter === 'REPLIED'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Replied
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="flex-1 overflow-y-auto">
            {loading && comments.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No comments found</p>
              </div>
            ) : (
              <div>
                {comments.map((comment) => (
                  <button
                    key={comment.id}
                    onClick={() => setSelectedComment(comment)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedComment?.id === comment.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">@{comment.username}</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            comment.status === 'OPEN'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {comment.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{comment.text}</p>
                    {comment.account_username && (
                      <p className="text-xs text-gray-500 mt-1">@{comment.account_username}</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Comment Details and Reply */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedComment ? (
            <>
              {/* Comment Details Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {selectedComment.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">@{selectedComment.username}</h3>
                      <p className="text-sm text-gray-500">{formatDate(selectedComment.timestamp)}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedComment.status === 'OPEN'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {selectedComment.status}
                  </span>
                </div>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedComment.text}</p>
              </div>

              {/* Replies Section */}
              {selectedCommentReplies.length > 0 && (
                <div className="flex-1 overflow-y-auto p-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Replies</h4>
                  <div className="space-y-4">
                    {selectedCommentReplies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {reply.replied_by || 'You'}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(reply.sent_at)}</span>
                        </div>
                        <p className="text-gray-700">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Box */}
              {selectedComment.status === 'OPEN' && (
                <div className="p-6 border-t border-gray-200">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={() => setReplyText('')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim() || replying}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {replying ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              )}

              {selectedComment.status === 'REPLIED' && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600 text-center">
                    This comment has been replied to.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">Select a comment to view details</p>
                <p className="text-sm">Choose a comment from the list to see full details and reply</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

