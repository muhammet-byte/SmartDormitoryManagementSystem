package com.dormitory.management_system.dto;

public class RoomMatchResponse {
    private Long roomId;
    private String roomName;
    private int matchScore;
    private int availableBeds;

    public RoomMatchResponse(Long roomId, String roomName, int matchScore, int availableBeds) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.matchScore = matchScore;
        this.availableBeds = availableBeds;
    }

    // Getter ve Setter'lar (Aşağıdakileri kopyala yapıştır)
    public Long getRoomId() { return roomId; }
    public String getRoomName() { return roomName; }
    public int getMatchScore() { return matchScore; }
    public int getAvailableBeds() { return availableBeds; }
}