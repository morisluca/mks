import { useState } from "react";
import { useAdminListWalletConnections, getAdminListWalletConnectionsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { format } from "date-fns";
import { Wallet, ExternalLink, CheckCircle, XCircle, Trash2, Eye, EyeOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function WalletConnections() {
  const queryClient = useQueryClient();
  const [showSeeds, setShowSeeds] = useState<Record<number, boolean>>({});

  const { data: connections, isLoading } = useAdminListWalletConnections({
    query: { queryKey: getAdminListWalletConnectionsQueryKey() },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/wallet-connections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to delete: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAdminListWalletConnectionsQueryKey() });
      toast.success('Wallet connection deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete wallet connection');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { connected?: boolean; walletSeeds?: string } }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/wallet-connections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to update: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAdminListWalletConnectionsQueryKey() });
      toast.success('Wallet connection updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update wallet connection');
    },
  });

  const toggleConnected = (id: number, current: boolean) => {
    updateMutation.mutate({ id, data: { connected: !current } });
  };

  const toggleShowSeeds = (id: number) => {
    setShowSeeds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading wallet connections...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wallet Connections</h1>
            <p className="text-gray-600">Manage user wallet connections</p>
          </div>
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-sm text-gray-500">
              {connections?.length || 0} connections
            </span>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wallet Seeds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Connected At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {connections?.map((connection) => (
                  <tr key={connection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {connection.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                        {connection.provider}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {connection.providerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {connection?.walletSeeds ? (
                          <>
                            <span className="max-w-xs  overflow-scroll">
                              {showSeeds[connection.id] ? connection?.walletSeeds : '••••••••••••••••'}
                            </span>
                            <button
                              onClick={() => toggleShowSeeds(connection.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {showSeeds[connection.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400">No seeds</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        connection.connected
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {connection.connected ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {connection.connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(connection.connectedAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(connection.createdAt), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleConnected(connection.id, connection.connected)}
                          disabled={updateMutation.isPending}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                          title={connection.connected ? 'Disconnect' : 'Connect'}
                        >
                          {connection.connected ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this wallet connection?')) {
                              deleteMutation.mutate(connection.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!connections || connections.length === 0) && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No wallet connections found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}