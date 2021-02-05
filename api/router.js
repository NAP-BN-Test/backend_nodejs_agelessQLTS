module.exports = function (app) {
    var checkToken = require('./constants/token');
    var tblDMUser = require('./controllers/ctl-tblDMUser');
    var tblDMNhanvien = require('./controllers/ctl-tblDMNhanvien');
    var tblDMPermission = require('./controllers/ctl-tblDMPermission');
    var tblDMLoaiTaiSan = require('./controllers/ctl-tblDMLoaiTaiSan');
    var tblYeuCauMuaSam = require('./controllers/ctl-tblYeuCauMuaSam');
    var tblDMHanghoa = require('./controllers/ctl-tblDMHangHoa');
    var tblDMNhaCungCap = require('./controllers/ctl-tblDMNhaCungCap');
    var tblTaiSan = require('./controllers/ctl-tblTaiSanADD');
    var tblDMBoPhan = require('./controllers/ctl-tblDMBoPhan');
    var tblDMChiNhanh = require('./controllers/ctl-tblDMChiNhanh');
    var tblVanPhongPham = require('./controllers/ctl-tblVanPhongPham');
    var tblThemVPP = require('./controllers/ctl-tblThemVPP');
    var tblDeNghiThanhToan = require('./controllers/ctl-tblDeNghiThanhToan');
    var tblTaiSanBanGiao = require('./controllers/ctl-tblTaiSanBanGiao');
    var tblPhanPhoiVPP = require('./controllers/ctl-tblPhanPhoiVPP');
    var tblFileAttach = require('./controllers/ctl-tblFileAttach');
    var tblNghiPhep = require('./controllers_hr/ctl-tblNghiPhep');
    var tblTemplate = require('./controllers/ctl-tblTemplate');
    var exportPDF = require('./controllers/export');

    app.route('/qlnb/convert_docx_to_pdf').post(exportPDF.convertDocxToPDF);

    app.route('/qlnb/export_to_file_excel').post(exportPDF.exportToFileExcel);

    app.route('/qlnb/export_to_file_excel_payment').post(exportPDF.exportToFileExcelPayment);


    app.route('/qlnb/delete_file').post(tblFileAttach.deletetblFileAttach);
    app.route('/qlnb/delete_file_from_link').post(tblFileAttach.deletetblFileFromLink);

    //---------------------------------------------------------------- Menu Quản lý danh mục--------------------------------------------------------------------------------------
    // Quản lý mẫu in
    app.route('/qlnb/add_tbl_template').post(checkToken.checkToken, tblTemplate.addTBLTemplate);
    app.route('/qlnb/update_tbl_template').post(checkToken.checkToken, tblTemplate.updateTBLTemplate);
    app.route('/qlnb/get_list_tbl_template').post(tblTemplate.getListTBLTemplate);
    app.route('/qlnb/delete_tbl_template').post(checkToken.checkToken, tblTemplate.deleteTBLTemplate);
    // Quản lý account
    app.route('/qlnb/login').post(tblDMUser.login);
    app.route('/qlnb/add_tbl_dmuser').post(checkToken.checkToken, tblDMUser.addtblDMUser);
    app.route('/qlnb/update_tbl_dmuser').post(checkToken.checkToken, tblDMUser.updatetblDMUser);
    app.route('/qlnb/delete_tbl_dmuser').post(checkToken.checkToken, tblDMUser.deletetblDMUser);
    app.route('/qlnb/get_list_tbl_dmuser').post(checkToken.checkToken, tblDMUser.getListtblDMUser);
    app.route('/qlnb/get_list_name_tbl_dmuser').post(checkToken.checkToken, tblDMUser.getListNametblDMUser);

    app.route('/qlnb/get_list_name_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.getListNametblDMNhanvien);

    app.route('/qlnb/get_list_name_tbl_dmpermission').post(checkToken.checkToken, tblDMPermission.getListNametblDMPermission);
    // Quản lý bộ phận
    app.route('/qlnb/add_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.addtblDMBoPhan);
    app.route('/qlnb/update_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.updatetblDMBoPhan);
    app.route('/qlnb/get_list_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.getListtblDMBoPhan);
    app.route('/qlnb/get_list_name_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.getListNametblDMBoPhan);
    app.route('/qlnb/delete_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.deletetblDMBoPhan);

    app.route('/qlnb/get_list_name_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.getListNametblDMChiNhanh);
    // Quản lý chi nhánh
    app.route('/qlnb/add_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.addtblDMChiNhanh);
    app.route('/qlnb/update_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.updatetblDMChiNhanh);
    app.route('/qlnb/get_list_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.getListtblDMChiNhanh);
    app.route('/qlnb/get_list_name_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.getListNametblDMChiNhanh);
    app.route('/qlnb/delete_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.deletetblDMChiNhanh);

    //  Quản lý nhân viên
    app.route('/qlnb/get_list_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.getListtblDMNhanvien);
    app.route('/qlnb/add_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.addtblDMNhanvien);

    app.route('/qlnb/delete_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.deletetblDMNhanvien);

    app.route('/qlnb/detail_tbl_dmnhanvien').post(tblDMNhanvien.detailtblDMNhanvien);

    app.route('/qlnb/notify_users').post(tblDMNhanvien.notifyUsers);

    app.route('/qlnb/update_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.updatetblDMNhanvien);
    app.route('/qlnb/get_list_name_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.getListNametblDMNhanvien);
    app.route('/qlnb/get_employee_from_department').post(checkToken.checkToken, tblDMNhanvien.getEmployeeFromDepartment);

    // Lịch sử sử dụng của nhân viên 
    app.route('/qlnb/get_list_history_nhanvien').post(checkToken.checkToken, tblDMNhanvien.getListHistoryNhanVien);


    //  Quản lý loại tài sản
    app.route('/qlnb/add_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.addtblDMLoaiTaiSan);
    app.route('/qlnb/update_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.updatetblDMLoaiTaiSan);
    app.route('/qlnb/get_list_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.getListtblDMLoaiTaiSan);
    app.route('/qlnb/delete_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.deletetblDMLoaiTaiSan);
    app.route('/qlnb/get_list_name_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.getListNametblDMLoaiTaiSan);

    // Danh mục tài sản
    app.route('/qlnb/add_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.addtblDMHangHoa);
    app.route('/qlnb/update_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.updatetblDMHangHoa);
    app.route('/qlnb/delete_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.deletetblDMHangHoa);
    app.route('/qlnb/get_list_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListtblDMHangHoa);
    app.route('/qlnb/get_list_name_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListNametblDMHangHoa);
    app.route('/qlnb/get_list_all_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListAlltblDMHangHoa);

    //  Danh mục nhà cung cấp
    app.route('/qlnb/add_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.addtblDMNhaCungCap);
    app.route('/qlnb/update_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.updatetblDMNhaCungCap);
    app.route('/qlnb/delete_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.deletetblDMNhaCungCap);
    app.route('/qlnb/get_list_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.getListtblDMNhaCungCap);
    app.route('/qlnb/get_list_name_tbl_dmnhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.getListNametblDMNhaCungCap);

    //  Danh mục văn phòng phẩm
    app.route('/qlnb/add_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.addtblVanPhongPham);
    app.route('/qlnb/update_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.updatetblVanPhongPham);
    app.route('/qlnb/delete_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.deletetblVanPhongPham);
    app.route('/qlnb/get_list_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.getListtblVanPhongPham);
    app.route('/qlnb/get_list_name_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.getListNametblVanPhongPham);


    //---------------------------------------------------------------- Menu yêu cầu mua sắm --------------------------------------------------------------------------------------
    // Đề nghị mua sắm
    app.route('/qlnb/add_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.addtblYeuCauMuaSam);
    app.route('/qlnb/update_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.updatetblYeuCauMuaSam);
    app.route('/qlnb/get_list_tbl_yeucaumuasam').post(tblYeuCauMuaSam.getListtblYeuCauMuaSam);

    app.route('/qlnb/get_detail_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.getDetailtblYeuCauMuaSam);

    app.route('/qlnb/get_tbl_request_from_payment').post(tblYeuCauMuaSam.gettblYeuCauMuaSamFromDeNghiThanhToan);

    app.route('/qlnb/delete_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.deletetblYeuCauMuaSam);

    // button approval
    app.route('/qlnb/approval_first_approver').post(checkToken.checkToken, tblYeuCauMuaSam.approvalFirstApprover);
    app.route('/qlnb/approval_second_approver').post(checkToken.checkToken, tblYeuCauMuaSam.approvalSecondApprover);
    app.route('/qlnb/refuse_first_approver').post(checkToken.checkToken, tblYeuCauMuaSam.refuseFirstApprover);
    app.route('/qlnb/refuse_second_approver').post(checkToken.checkToken, tblYeuCauMuaSam.refuseSecondApprover);
    app.route('/qlnb/cancel_purchase').post(checkToken.checkToken, tblYeuCauMuaSam.cancelPurchase);
    app.route('/qlnb/done_purchase').post(checkToken.checkToken, tblYeuCauMuaSam.donePurchase);
    // app.route('/qlnb/get_list_name_tbl_yeucaumuasam').post(checkToken.checkToken ,tblYeuCauMuaSam.getListNametblYeuCauMuaSam);

    // lấy name hang hoa
    app.route('/qlnb/get_list_name_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListNametblDMHangHoa);
    app.route('/qlnb/get_list_asset_from_goods').post(checkToken.checkToken, tblDMHanghoa.getListAssetFromGoods);
    app.route('/qlnb/get_list_asset_from_goods_additional').post(checkToken.checkToken, tblDMHanghoa.getListAssetFromGoodsAdditional);

    // lấy name nhân viên ---- dòng 24
    //---------------------------------------------------------------- Menu quản lý tài sản --------------------------------------------------------------------------------------

    app.route('/qlnb/add_tbl_taisan_bangiao').post(checkToken.checkToken, tblTaiSanBanGiao.addtblTaiSanBanGiao);
    app.route('/qlnb/update_tbl_taisan_bangiao').post(checkToken.checkToken, tblTaiSanBanGiao.updatetblTaiSanBanGiao);
    // app.route('/qlnb/get_list_tbl_taisan_bangiao').post(tblTaiSanBanGiao.deleteRelationshiptblTaiSanBanGiao);
    // app.route('/qlnb/get_list_tbl_taisan_bangiao').post(tblTaiSanBanGiao.addtblTaiSanBanGiao);



    app.route('/qlnb/detail_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.detailtblTaiSanADD);
    app.route('/qlnb/update_detail_asset').post(checkToken.checkToken, tblTaiSan.updateDetailAsset);
    app.route('/qlnb/get_list_history_staff_use').post(checkToken.checkToken, tblTaiSan.getListHistoryStaffUse);


    app.route('/qlnb/add_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.addtblTaiSanADD);
    app.route('/qlnb/update_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.updatetblTaiSanADD);
    app.route('/qlnb/delete_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.deletetblTaiSanADD);
    app.route('/qlnb/get_list_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanADD);
    app.route('/qlnb/get_list_tbl_taisan_chuasudung').post(tblTaiSan.getListtblTaiSanChuaSuDung);
    app.route('/qlnb/get_list_tbl_taisan_theodoi').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanTheoDoi);



    app.route('/qlnb/get_list_attach_asset').post(checkToken.checkToken, tblTaiSan.getListAttachAsset);

    app.route('/qlnb/replace_asset_attach').post(checkToken.checkToken, tblTaiSan.replateAssetAttach);

    app.route('/qlnb/additional_asset_attach').post(checkToken.checkToken, tblTaiSan.additionalAssetAttach);

    app.route('/qlnb/delete_asset_attach').post(checkToken.checkToken, tblTaiSan.deleteAssetAttach);

    app.route('/qlnb/withdraw_asset').post(checkToken.checkToken, tblTaiSan.withdrawAsset);

    app.route('/qlnb/get_list_asset_not_use').post(checkToken.checkToken, tblTaiSan.getListAssetNotuse);



    //---------------------------------------------------------------- Menu quản lý văn phòng phẩm --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.addTBLThemVPP);
    app.route('/qlnb/update_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.updateTBLThemVPP);
    app.route('/qlnb/delete_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.deleteRelationshipTBLThemVPP);
    app.route('/qlnb/get_list_tbl_them_vpp').post(tblThemVPP.getListTBLThemVPP);
    app.route('/qlnb/get_list_name_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.getListNameTBLThemVPP);
    app.route('/qlnb/get_detail_tbl_them_vpp').post(tblThemVPP.getDetailTBLThemVPP);


    app.route('/qlnb/add_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.addTBLPhanPhoiVPP);
    app.route('/qlnb/update_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.updateTBLPhanPhoiVPP);
    app.route('/qlnb/delete_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.deleteRelationshipTBLPhanPhoiVPP);
    app.route('/qlnb/get_list_tbl_phanphoi_vpp').post(tblPhanPhoiVPP.getListTBLPhanPhoiVPP);

    // get list name NCC dòng 63

    //---------------------------------------------------------------- Menu đề nghị thanh toán --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.addtblDeNghiThanhToan);
    app.route('/qlnb/update_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.updatetblDeNghiThanhToan);
    app.route('/qlnb/delete_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.deletetblDeNghiThanhToan);
    app.route('/qlnb/get_list_tbl_denghi_thanhtoan').post(tblDeNghiThanhToan.getListtblDeNghiThanhToan);
    app.route('/qlnb/detail_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.detailtblDeNghiThanhToan);

    app.route('/qlnb/get_list_name_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.getListNametblDeNghiThanhToan);


    app.route('/qlnb/approval_employee_accountant').post(checkToken.checkToken, tblDeNghiThanhToan.approvalNhanVienKTPD);
    app.route('/qlnb/approval_employee_leader').post(checkToken.checkToken, tblDeNghiThanhToan.approvalNhanVienLDPD);
    app.route('/qlnb/refuse_employee_accountant').post(checkToken.checkToken, tblDeNghiThanhToan.refuseNhanVienKTPD);
    app.route('/qlnb/refuse_employee_leader').post(checkToken.checkToken, tblDeNghiThanhToan.refuseNhanVienLDPD);
    // app.route('/qlnb/approval_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.approvalDeNghiThanhToan);
    var zalo = require('./controllers/zalo');
    app.route('/zalo').post(zalo.zalo);


    var report = require('./controllers/report');
    app.route('/qlnb/report').post(report.report);


    // ************************************************************** QUẢN LÝ NHÂN SỰ **********************************************************************************************

    //---------------------------------------------------------------- Menu danh mục --------------------------------------------------------------------------------------
    var tblLoaiChamCong = require('./controllers_hr/ctl-tblLoaiChamCong');
    var tblNghiLe = require('./controllers_hr/ctl-tblNghiLe');
    var tblDMTinhTrangNV = require('./controllers_hr/ctl-tblDMTinhTrangNV');
    var tblDMLoaiHopDong = require('./controllers_hr/ctl-tblLoaiHopDong');
    var tblDMGiaDinh = require('./controllers_hr/ctl-tblDMGiaDinh');

    var tblDMChucVu = require('./controllers/ctl-tblDMChucVu');

    // Danh mục loại hợp đồng
    app.route('/qlnb/add_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.addtblLoaiHopDong);
    app.route('/qlnb/update_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.updatetblLoaiHopDong);
    app.route('/qlnb/delete_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.deletetblLoaiHopDong);
    app.route('/qlnb/get_list_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.getListtblLoaiHopDong);
    app.route('/qlnb/get_list_name_tbl_loaihopdong').post(checkToken.checkToken, tblDMLoaiHopDong.getListNametblLoaiHopDong);

    // Danh mục loại chấm công
    app.route('/qlnb/add_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.addtblLoaiChamCong);
    app.route('/qlnb/update_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.updatetblLoaiChamCong);
    app.route('/qlnb/delete_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.deletetblLoaiChamCong);
    app.route('/qlnb/get_list_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.getListtblLoaiChamCong);
    app.route('/qlnb/get_list_name_tbl_loaichamcong').post(checkToken.checkToken, tblLoaiChamCong.getListNametblLoaiChamCong);


    app.route('/qlnb/get_list_name_tbl_dmchucvu').post(checkToken.checkToken, tblDMChucVu.getListNametblDMChucVu);

    // Danh mục nghỉ lễ
    app.route('/qlnb/add_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.addtblNghiLe);
    app.route('/qlnb/update_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.updatetblNghiLe);
    app.route('/qlnb/delete_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.deletetblNghiLe);
    app.route('/qlnb/get_list_tbl_nghiLe').post(tblNghiLe.getListtblNghiLe);
    app.route('/qlnb/get_list_name_tbl_nghiLe').post(checkToken.checkToken, tblNghiLe.getListNametblNghiLe);

    // Danh mục nghỉ lễ
    app.route('/qlnb/add_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.addtblNghiPhep);
    app.route('/qlnb/update_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.updatetblNghiPhep);
    app.route('/qlnb/delete_tbl_nghiphep').post(checkToken.checkToken, tblNghiPhep.deletetblNghiPhep);
    app.route('/qlnb/approval_head_department').post(checkToken.checkToken, tblNghiPhep.approvalHeadDepartment);
    app.route('/qlnb/approval_administration_hr').post(checkToken.checkToken, tblNghiPhep.approvalAdministrationHR);
    app.route('/qlnb/approval_heads').post(checkToken.checkToken, tblNghiPhep.approvalHeads);
    app.route('/qlnb/handle_take_leave_day').post(tblNghiPhep.handleTakeLeaveDay);

    //  Danh mục tình trạng nhân viên
    app.route('/qlnb/add_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.addtblDMTinhTrangNV);
    app.route('/qlnb/update_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.updatetblDMTinhTrangNV);
    app.route('/qlnb/delete_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.deletetblDMTinhTrangNV);
    app.route('/qlnb/get_list_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.getListtblDMTinhTrangNV);
    app.route('/qlnb/get_list_name_tbl_dm_tinhtrangnv').post(checkToken.checkToken, tblDMTinhTrangNV.getListNametblDMTinhTrangNV);

    // Danh mục bộ phận
    // 35-40

    // Danh mục chi nhánh
    // 43-47

    //---------------------------------------------------------------- Menu trích ngang --------------------------------------------------------------------------------------

    // 49-54

    // Tabs quan hệ gia đình 
    app.route('/qlnb/add_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.addtblDMGiaDinh);
    app.route('/qlnb/update_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.updatetblDMGiaDinh);
    app.route('/qlnb/delete_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.deletetblDMGiaDinh);
    app.route('/qlnb/get_list_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.getListtblDMGiaDinh);
    app.route('/qlnb/get_list_name_tbl_dmgiadinh').post(checkToken.checkToken, tblDMGiaDinh.getListNametblDMGiaDinh);

    // Tabs quản lý đào tạo sau khi đến công ty
    var tblDaoTaoSau = require('./controllers_hr/ctl-tblDaoTaoSau');
    app.route('/qlnb/add_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.addtblDaoTaoSaus);
    app.route('/qlnb/update_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.updatetblDaoTaoSaus);
    app.route('/qlnb/delete_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.deletetblDaoTaoSaus);
    app.route('/qlnb/get_list_tbl_training_after').post(checkToken.checkToken, tblDaoTaoSau.getListtblDaoTaoSaus);

    // Tabs quản lý đào tạo trước khi đến công ty
    var tblDaoTaoTruoc = require('./controllers_hr/ctl-tblDaoTaoTruoc');
    app.route('/qlnb/add_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.addtblDaoTaoTruoc);
    app.route('/qlnb/update_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.updatetblDaoTaoTruoc);
    app.route('/qlnb/delete_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.deletetblDaoTaoTruoc);
    app.route('/qlnb/get_list_tbl_pre_training').post(checkToken.checkToken, tblDaoTaoTruoc.getListtblDaoTaoTruoc);

    // Lịch sử công tác
    var tblWorkHistory = require('./controllers_hr/ctl-tblWorkHistory');
    app.route('/qlnb/add_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.addtblWorkHistory);
    app.route('/qlnb/update_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.updatetblWorkHistory);
    app.route('/qlnb/delete_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.deletetblWorkHistory);
    app.route('/qlnb/get_list_tbl_work_history').post(checkToken.checkToken, tblWorkHistory.getListtblWorkHistory);

    // Quản lý hợp đồng
    var tblHopDongNhanSu = require('./controllers_hr/ctl-tblHopDongNhanSu');
    app.route('/qlnb/add_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.addtblHopDongNhanSu);
    app.route('/qlnb/update_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.updatetblHopDongNhanSu);
    app.route('/qlnb/delete_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.deletetblHopDongNhanSu);
    app.route('/qlnb/get_list_tbl_hopdong_nhansu').post(checkToken.checkToken, tblHopDongNhanSu.getListtblHopDongNhanSu);

    app.route('/qlnb/get_list_tbl_hopdong_nhansu_detail').post(tblHopDongNhanSu.getListtblHopDongNhanSuDetail);

    // Quyết định tăng lương
    var tblQuyetDinhTangLuong = require('./controllers_hr/ctl-tblQuyetDinhTangLuong');
    app.route('/qlnb/add_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.addtblQuyetDinhTangLuong);
    app.route('/qlnb/update_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.updatetblQuyetDinhTangLuong);
    app.route('/qlnb/delete_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.deletetblQuyetDinhTangLuong);
    app.route('/qlnb/get_list_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.getListtblQuyetDinhTangLuong);
    app.route('/qlnb/get_detail_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.detailtblQuyetDinhTangLuong);

    //---------------------------------------------------------------- Mẫu bảng lương --------------------------------------------------------------------------------------
    var tblBangLuong = require('./controllers_hr/ctl-tblBangLuong');
    app.route('/qlnb/get_list_tbl_bangluong').post(tblBangLuong.getListtblBangLuong);
    app.route('/qlnb/track_insurance_premiums').post(tblBangLuong.trackInsurancePremiums);

    app.route('/qlnb/data_timekeeping').post(tblBangLuong.dataTimekeeping);

    app.route('/qlnb/update_timekeeping').post(tblBangLuong.updateTimekeeping);

    app.route('/qlnb/data_export_excel').post(tblBangLuong.dataExportExcel);

    app.route('/qlnb/delete_all_timekeeping').post(tblBangLuong.deleteAllTimekeeping);

    //---------------------------------------------------------------- Mức đóng bảo hiểm --------------------------------------------------------------------------------------
    var tblMucDongBaoHiem = require('./controllers_hr/ctl-tblMucDongBaoHiem');
    app.route('/qlnb/add_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.addtblMucDongBaoHiem);
    app.route('/qlnb/update_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.updatetblMucDongBaoHiem);
    app.route('/qlnb/delete_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.deletetblMucDongBaoHiem);
    app.route('/qlnb/get_list_tbl_mucdong_baohiem').post(checkToken.checkToken, tblMucDongBaoHiem.getListtblMucDongBaoHiem);

    //---------------------------------------------------------------- Quyết định tăng lương --------------------------------------------------------------------------------------
    var tblQuyetDinhTangLuong = require('./controllers_hr/ctl-tblQuyetDinhTangLuong');
    app.route('/qlnb/add_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.addtblQuyetDinhTangLuong);
    app.route('/qlnb/update_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.updatetblQuyetDinhTangLuong);
    app.route('/qlnb/delete_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.deletetblQuyetDinhTangLuong);
    app.route('/qlnb/get_list_tbl_quyetdinh_tangluong').post(checkToken.checkToken, tblQuyetDinhTangLuong.getListtblQuyetDinhTangLuong);

    // Quản lý loại hợp đồng 
    var tblTypeContract = require('./controllers_hr/ctl-tblLoaiHopDong');
    app.route('/qlnb/add_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.addtblLoaiHopDong);
    app.route('/qlnb/update_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.updatetblLoaiHopDong);
    app.route('/qlnb/delete_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.deletetblLoaiHopDong);
    app.route('/qlnb/get_list_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.getListtblLoaiHopDong);
    app.route('/qlnb/get_list_name_tbl_loaihopdong').post(checkToken.checkToken, tblTypeContract.getListNametblLoaiHopDong);

    // Quản lý ngày làm việc
    var tblConfigWorkday = require('./controllers_hr/ctl-tblConfigWorkday')
    app.route('/qlnb/add_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.addtblConfigWorkday);
    app.route('/qlnb/update_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.updatetblConfigWorkday);
    app.route('/qlnb/delete_tbl_config_workday').post(checkToken.checkToken, tblConfigWorkday.deletetblConfigWorkday);
    app.route('/qlnb/get_list_tbl_config_workday').post(tblConfigWorkday.getListtblConfigWorkday);

    // // Quản lý nghỉ lễ / tết
    // var tblQuanLyNghiLe = require('./controllers_hr/ctl-tblNghiLe');
    // app.route('/qlnb/add_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.addtblNghiLe);
    // app.route('/qlnb/update_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.updatetblNghiLe);
    // app.route('/qlnb/delete_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.deletetblNghiLe);
    // app.route('/qlnb/get_list_tbl_nghile').post(checkToken.checkToken, tblQuanLyNghiLe.getListtblNghiLe);


    // ************************************************************** QUẢN LÝ TÀI CHÍNH **********************************************************************************************
    var tblVayTamUng = require('./controller_finance/ctl-tblVayTamUng')
    app.route('/qlnb/get_list_tbl_vaytamung').post(tblVayTamUng.getListtblVayTamUng);
    app.route('/qlnb/get_detail_tbl_vaytamung').post(tblVayTamUng.detailtblVayTamUng);
}