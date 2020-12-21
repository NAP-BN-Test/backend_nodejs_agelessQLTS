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

    app.route('/qlnb/delete_file').post(tblFileAttach.deletetblFileAttach);
    app.route('/qlnb/delete_file_from_link').post(tblFileAttach.deletetblFileFromLink);

    //---------------------------------------------------------------- Menu Quản lý danh mục--------------------------------------------------------------------------------------
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
    app.route('/qlnb/delete_tbl_dm_bophan').post(checkToken.checkToken, tblDMBoPhan.deleteRelationshiptblDMBoPhan);

    app.route('/qlnb/get_list_name_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.getListNametblDMChiNhanh);
    // Quản lý chi nhánh
    app.route('/qlnb/add_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.addtblDMChiNhanh);
    app.route('/qlnb/update_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.updatetblDMChiNhanh);
    app.route('/qlnb/get_list_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.getListtblDMChiNhanh);
    app.route('/qlnb/delete_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.deletetblDMChiNhanh);

    //  Quản lý nhân viên
    app.route('/qlnb/get_list_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.getListtblDMNhanvien);
    app.route('/qlnb/get_employee_from_department').post(tblDMNhanvien.getEmployeeFromDepartment);

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

    app.route('/qlnb/get_detail_tbl_yeucaumuasam').post(tblYeuCauMuaSam.getDetailtblYeuCauMuaSam);

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



    app.route('/qlnb/detail_tbl_taisanadd').post(tblTaiSan.detailtblTaiSanADD);
    app.route('/qlnb/update_detail_asset').post(tblTaiSan.updateDetailAsset);
    app.route('/qlnb/get_list_history_staff_use').post(tblTaiSan.getListHistoryStaffUse);


    app.route('/qlnb/add_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.addtblTaiSanADD);
    app.route('/qlnb/update_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.updatetblTaiSanADD);
    app.route('/qlnb/delete_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.deletetblTaiSanADD);
    app.route('/qlnb/get_list_tbl_taisanadd').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanADD);
    app.route('/qlnb/get_list_tbl_taisan_chuasudung').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanChuaSuDung);
    app.route('/qlnb/get_list_tbl_taisan_theodoi').post(checkToken.checkToken, tblTaiSan.getListtblTaiSanTheoDoi);



    app.route('/qlnb/get_list_attach_asset').post(tblTaiSan.getListAttachAsset);

    app.route('/qlnb/replace_asset_attach').post(tblTaiSan.replateAssetAttach);

    app.route('/qlnb/additional_asset_attach').post(tblTaiSan.additionalAssetAttach);

    app.route('/qlnb/withdraw_asset').post(tblTaiSan.withdrawAsset);

    app.route('/qlnb/get_list_asset_not_use').post(tblTaiSan.getListAssetNotuse);



    //---------------------------------------------------------------- Menu quản lý văn phòng phẩm --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.addTBLThemVPP);
    app.route('/qlnb/update_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.updateTBLThemVPP);
    app.route('/qlnb/delete_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.deleteRelationshipTBLThemVPP);
    app.route('/qlnb/get_list_tbl_them_vpp').post(tblThemVPP.getListTBLThemVPP);
    app.route('/qlnb/get_list_name_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.getListNameTBLThemVPP);


    app.route('/qlnb/add_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.addTBLPhanPhoiVPP);
    app.route('/qlnb/update_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.updateTBLPhanPhoiVPP);
    app.route('/qlnb/delete_tbl_phanphoi_vpp').post(checkToken.checkToken, tblPhanPhoiVPP.deleteRelationshipTBLPhanPhoiVPP);
    app.route('/qlnb/get_list_tbl_phanphoi_vpp').post(tblPhanPhoiVPP.getListTBLPhanPhoiVPP);

    // get list name NCC dòng 63

    //---------------------------------------------------------------- Menu đề nghị thanh toán --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.addtblDeNghiThanhToan);
    app.route('/qlnb/update_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.updatetblDeNghiThanhToan);
    app.route('/qlnb/delete_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.deleteRelationshiptblDeNghiThanhToan);
    app.route('/qlnb/get_list_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.getListtblDeNghiThanhToan);
    app.route('/qlnb/get_list_name_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.getListNametblDeNghiThanhToan);
    app.route('/qlnb/approval_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.approvalDeNghiThanhToan);
    var zalo = require('./controllers/zalo');
    app.route('/zalo').post(zalo.zalo);






    // ************************************************************** QUẢN LÝ NHÂN SỰ **********************************************************************************************

}