import { useState } from "react";
import { INITIAL_CLIENTS } from "@/mock/adminMockData";
import type { Client } from "@/mock/adminMockData";
import { MagnifyingGlass as MagnifyingGlassIcon, DotsThreeVertical as DotsThreeVerticalIcon } from "@phosphor-icons/react";

export default function Clients() {
    const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const deleteClient = (id: string) => {
        setClients(clients.filter(c => c.id !== id));
        setActiveDropdown(null);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-ink dark:text-parchment">
                    Registered Clients
                </h1>
                <p className="text-sm text-black/50 dark:text-parchment/50 mt-1">
                    View client portfolios, history logs, registration details, and actions.
                </p>
            </div>

            {/* Filters / Search Bar */}
            <div className="bg-surface dark:bg-card-dark rounded-2xl border border-black/10 dark:border-white/5 p-4 shadow-card flex items-center">
                <div className="relative flex-1 max-w-md">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate dark:text-slate/60">
                        <MagnifyingGlassIcon size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search clients by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-parchment/30 dark:bg-ink/30 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 text-ink dark:text-parchment"
                    />
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-surface dark:bg-card-dark rounded-3xl border border-black/10 dark:border-white/5 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredClients.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-sm font-semibold text-black/40 dark:text-parchment/40">
                                No clients found matching your query.
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] text-xs font-bold uppercase tracking-wider text-black/40 dark:text-parchment/40">
                                    <th className="px-6 py-4">Client Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Registered Date</th>
                                    <th className="px-6 py-4">Consultations Completed</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                {filteredClients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                                    >
                                        <td className="px-6 py-4 font-semibold text-ink dark:text-parchment">
                                            {client.name}
                                        </td>
                                        <td className="px-6 py-4 text-black/80 dark:text-parchment/80">
                                            {client.email}
                                        </td>
                                        <td className="px-6 py-4 text-black/60 dark:text-parchment/60">
                                            {client.joinDate}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-ink dark:text-parchment">
                                            {client.appointmentCount} calls
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === client.id ? null : client.id)}
                                                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate"
                                                aria-label="Toggle action menu"
                                            >
                                                <DotsThreeVerticalIcon size={20} weight="bold" />
                                            </button>

                                            {activeDropdown === client.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                                    <div className="absolute right-6 top-12 z-20 w-44 bg-surface dark:bg-card-dark rounded-xl border border-black/10 dark:border-white/10 shadow-lg py-1.5 text-left text-xs">
                                                        <button
                                                            onClick={() => deleteClient(client.id)}
                                                            className="w-full px-4 py-2 hover:bg-red-500/5 text-red-500 font-semibold text-left"
                                                        >
                                                            Deactivate Client
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
