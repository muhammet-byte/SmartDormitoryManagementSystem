package com.dorm.backend.service;

import com.dorm.backend.model.LeaveRequest;
import com.dorm.backend.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaveRequestService {
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }
}
