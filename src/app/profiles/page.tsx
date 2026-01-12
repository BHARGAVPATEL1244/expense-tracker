"use client";

import { useEffect, useState } from "react";

interface Profile {
    id: string;
    name: string;
    note?: string;
    netBalance: number;
    spentForThem: number;
    receivedFromThem: number;
}

export default function ProfilesPage() {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/profiles")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProfiles(data);
                } else {
                    console.error("Profiles API returned non-array:", data);
                    setProfiles([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (profiles.length === 0) return <p>No profiles found.</p>;

    return (
        <div>
            <h2>Profiles</h2>
            <ul>
                {profiles.map((p) => (
                    <li key={p.id}>
                        <strong>{p.name}</strong>
                        {p.note && <span> – {p.note}</span>}
                        <div>Net Balance: {p.netBalance}</div>
                        <div>Spent for them: {p.spentForThem}</div>
                        <div>Received from them: {p.receivedFromThem}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
