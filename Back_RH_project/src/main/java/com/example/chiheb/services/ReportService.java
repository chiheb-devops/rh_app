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
import java.util.*;

@Service
public class ReportService {

    @Autowired
    private employeeRepository employeeRepository;
    @Autowired
    private deptRepository deptRepository;
    @Autowired
    private RegionRepository regionRepository;

    public byte[] exportReport(String reportName, String reportFormat, Long region_id, Long dept_id, Long id) throws JRException, FileNotFoundException {

        // 1. Setup Parameters (Must match XML variables: SelectedRegion and SelectedDept)
        Map<String, Object> parameters = new HashMap<>();

        parameters.put("createdBy", "Chiheb App");
        parameters.put("SelectedRegion", "All Regions");
        parameters.put("SelectedDept", "All Departments");


        // 2. Load File )

        String path = "C:\\Users\\MSI\\OneDrive\\Bureau\\" + reportName + ".jrxml";
        File file = new File(path);
        if (!file.exists()) {
            throw new FileNotFoundException("Report file not found at: " + path);
        }

        List<employee> list = new ArrayList<>();
if ( reportName.toLowerCase().startsWith("report")){
    parameters.put("id", id);
    if (id != null) {
        Optional<employee> emp = employeeRepository.findById(id);

        list.add(employeeRepository.getById(id));
        System.out.println("nnnnnnnnnnnnnok fdlkv,kfd,vkdfvs,d kld,sqlk,nklqds, ");
    }
    else {
        list = employeeRepository.findAll();
    }
}
else {
    System.out.println("ok fdlkv,kfd,vkdfvs,d kld,sqlk,nklqds, ");
    // 3. LOGIC: FILTERING
        if (dept_id != null) {
            list = employeeRepository.findBydept_id(dept_id);
            dept d = deptRepository.findById(dept_id).orElse(null);
            parameters.put("SelectedDept", d.getId());
            parameters.put("SelectedRegion", d.getRegionName());
        } else {
            list = employeeRepository.findAll();

        }
}
        // 4. MAP DATA TO XML FIELDS (Mapping your Entity fields to Jasper Fields)
        List<Map<String, Object>> dataList = new ArrayList<>();
        for (employee emp : list) {
            Map<String, Object> row = new HashMap<>();
            row.put("ID", emp.getId());
            row.put("FIRST_NAME", emp.getFIRST_NAME());
            row.put("LAST_NAME", emp.getLAST_NAME());
            row.put("SALARY", emp.getSalary());
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

