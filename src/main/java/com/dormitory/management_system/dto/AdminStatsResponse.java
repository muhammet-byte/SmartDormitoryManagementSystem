package com.dormitory.management_system.dto;

public class AdminStatsResponse {
    private long totalStudents;
    private long totalRooms;
    private int totalCapacity;
    private int emptyBeds;
    private long pendingRequests;

    public AdminStatsResponse(long totalStudents, long totalRooms, int totalCapacity, int emptyBeds, long pendingRequests) {
        this.totalStudents = totalStudents;
        this.totalRooms = totalRooms;
        this.totalCapacity = totalCapacity;
        this.emptyBeds = emptyBeds;
        this.pendingRequests = pendingRequests;
    }

    // Getter metotlarını ekle (React'ın okuyabilmesi için şart)
    public long getTotalStudents() { return totalStudents; }
    public long getTotalRooms() { return totalRooms; }
    public int getTotalCapacity() { return totalCapacity; }
    public int getEmptyBeds() { return emptyBeds; }
    public long getPendingRequests() { return pendingRequests; }
}