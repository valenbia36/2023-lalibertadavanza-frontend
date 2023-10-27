import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function WaterGlassBarChart({ data }) {
    
    return (
        <ResponsiveContainer width="100%" height={400} style={{ fontSize: '14px' }}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid stroke="transparent" />
                <XAxis dataKey="_id" label={{
                    value: "Date",
                    position: "bottom",
                    fontSize: 14,
                    fontWeight: "bold",
                }} />
                <YAxis interval={1} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" stroke="black" />
            </BarChart>
        </ResponsiveContainer>
    );
}