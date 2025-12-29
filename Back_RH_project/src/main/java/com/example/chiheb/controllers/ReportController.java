package com.example.chiheb.controllers;

import com.example.chiheb.services.ReportService;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;

@RestController
@RequestMapping("/api/reports")
public class ReportController {


    @Autowired
    private ReportService reportService;




    @GetMapping("/{reportName}")
    public ResponseEntity<byte[]> generateReport( @PathVariable String reportName,

                                                  @RequestParam(name = "region_id", required = false) Long region_id,
                                                  @RequestParam(name = "deptId", required = false) Long dept_id ,@RequestParam(name = "id", required = false)  Long id) throws FileNotFoundException, JRException {
        System.out.println(reportName +" id "+id+" reg "+   region_id+"  dept "+dept_id );
        // 1. Call Service:
        byte[] data = reportService.exportReport(reportName, "pdf",region_id, dept_id,id);

        // 2. Set Headers: This tells the browser to download the file
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + reportName + ".pdf");

        // 3. Return the PDF Blob
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);

    }






}