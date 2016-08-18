package com.neusoft.hit.fe.core.handler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.neusoft.hit.fe.core.exception.FormEngineException;
import com.neusoft.hit.fe.core.model.ResultInfo;
import com.neusoft.hit.fe.core.model.UploadCfgInfo;
import com.neusoft.hit.fe.core.utility.ConfigUtil;

import net.sf.json.JSONObject;

public class ImgUploadHandler {
	private static final Log LOGGER = LogFactory.getLog(ImgUploadHandler.class);
	
	private long maxSize;
	private String savePath;
	private String fileType;
	
	public ImgUploadHandler() {
		UploadCfgInfo upload = ConfigUtil.getUploadCfg();
		this.maxSize = upload.getMaxSize();//config.getLong("upload.maxSize", 1000000);
		this.savePath = upload.getSavePath();//config.getString("upload.path", "\\upload");
		this.fileType = upload.getFileType();//config.getString("upload.fileType", "gif,jpg,jpeg,png,bmp");
	}
	
	public void upload(HttpServletRequest req, HttpServletResponse resp) throws FormEngineException {
		try {
			if(!ServletFileUpload.isMultipartContent(req)){
				resp.getWriter().println(ResultInfo.getFailureResult("请选择文件"));
				return;
			}
			FileItemFactory factory = new DiskFileItemFactory();
			ServletFileUpload upload = new ServletFileUpload(factory);
			upload.setHeaderEncoding("UTF-8");
			List<?> items = upload.parseRequest(req);
			Iterator<?> itr = items.iterator();
			while (itr.hasNext()) {
				FileItem item = (FileItem) itr.next();
				String fileName = item.getName();
				long fileSize = item.getSize();
				if (!item.isFormField()) {
					if(fileSize > maxSize){
						resp.getWriter().println(ResultInfo.getFailureResult("上传文件大小超过限制。"));
						return;
					}
					String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
					if(!Arrays.<String>asList(fileType.split(",")).contains(fileExt)){
						resp.getWriter().println(ResultInfo.getFailureResult("上传文件扩展名是不允许的扩展名。\n只允许" + fileType + "格式。"));
						return;
					}

					SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
					String newFileName = df.format(new Date()) + "_" + new Random().nextInt(1000) + "." + fileExt;
					try{
						File uploadedFile = new File(savePath, newFileName);
						item.write(uploadedFile);
					} catch(Exception e) {
						resp.getWriter().println(ResultInfo.getFailureResult(e.toString()));
						return;
					}

					JSONObject obj = new JSONObject();
					obj.put("error", 0);
					String downloadUrl = "form/download.process?img=" + newFileName;
					System.out.println(downloadUrl);
					obj.put("url", downloadUrl);
					resp.getWriter().write(ResultInfo.getResult(obj));
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("上传文件时发生错误，操作失败 ！", e);
		}
	}
	
	public void download(HttpServletRequest req, HttpServletResponse resp) throws FormEngineException {
		String imageName = req.getParameter("img");
		try {
			InputStream in = new FileInputStream(new File(savePath, imageName));
			OutputStream out = resp.getOutputStream();
			byte buffer[] = new byte[1024];
			int len = 0;
			while((len = in.read(buffer))>0){
				out.write(buffer, 0, len);
			}
			in.close();
			out.close();
		} catch (IOException e) {
			LOGGER.error(e.toString(), e);
			throw new FormEngineException("下载文件时发生错误，操作失败 ！", e);
		}
	}
}
