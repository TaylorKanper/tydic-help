package com.tydic.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.UUID;

/**
 * Created by hp on 2016/11/29.
 */
@Controller
@RequestMapping("/file")
public class FileUpload {
    /**
     * 文件上传
     *
     * @param request
     * @param userfile
     * @return
     */
    @RequestMapping("/static-uploads")
    @ResponseBody
    public String upload(HttpServletRequest request,
                         @RequestParam("userfile") CommonsMultipartFile userfile) {

        String fileName = userfile.getOriginalFilename();
        String serverPicName = UUID.randomUUID().toString()+"."+fileName.split("[.]")[1];
        ServletContext context = request.getSession().getServletContext();

        String realPath = context.getRealPath("/img/" + serverPicName);

        try {
            userfile.getFileItem().write(new File(realPath));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return serverPicName;
    }

}
