package com.example.chiheb.services;

import com.example.chiheb.entity.dept;
import com.example.chiheb.entity.employee;
import com.example.chiheb.repository.RegionRepository;
import com.example.chiheb.repository.deptRepository;
import com.example.chiheb.repository.employeeRepository;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class ReportService {

    @Autowired
    private employeeRepository employeeRepository;
    @Autowired
    private deptRepository deptRepository;
    @Autowired
    private RegionRepository regionRepository;

    public byte[] exportReport(String reportName, String reportFormat, Long region_id, Long dept_id) throws JRException, FileNotFoundException {

        // 1. Setup Parameters (Must match XML variables: SelectedRegion and SelectedDept)
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("createdBy", "Chiheb App");

        // Initialize with default strings for the report header
        parameters.put("SelectedRegion", "All Regions");
        parameters.put("SelectedDept", "All Departments");
        System.out.println(dept_id);
        // 2. Load File (Ensure the path matches your Desktop file exactly)
        // If reportName is "filtred_employees", path is C:\...\filtred_employees.jrxml
        String path = "C:\\Users\\MSI\\OneDrive\\Bureau\\" + reportName + ".jrxml";
        File file = new File(path);
        if (!file.exists()) {
            throw new FileNotFoundException("Report file not found at: " + path);
        }

        List<employee> list = new ArrayList<>();

        // 3. LOGIC: FILTERING
    if (dept_id != null) {

        list = employeeRepository.findBydept_id(dept_id);
        dept d = deptRepository.findById(dept_id).orElse(null);

        parameters.put("SelectedDept", d.getId());

        parameters.put("SelectedRegion", d.getRegionName());
    }
    else
    {  list = employeeRepository.findAll();
    }




            // 4. MAP DATA TO XML FIELDS (Mapping your Entity fields to Jasper Fields)
            List<Map<String, Object>> dataList = new ArrayList<>();
            for (employee emp : list) {
                Map<String, Object> row = new HashMap<>();
                row.put("ID", emp.getId());
                row.put("FIRST_NAME", emp.getFIRST_NAME());
                row.put("LAST_NAME", emp.getLAST_NAME());
                row.put("SALARY", emp.getSALARY());
                row.put("LIBDEPT", emp.getDeptName());
                row.put("REGION_NAME", emp.getRegionName());
                dataList.add(row);

            }
            // 5. Generate and Export
            JasperReport jasperReport = JasperCompileManager.compileReport(file.getAbsolutePath());
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(dataList);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            return JasperExportManager.exportReportToPdf(jasperPrint);

    }
}