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
    app.route('/qlnb/delete_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.getListtblDMChiNhanh);
    app.route('/qlnb/delete_tbl_dm_chinhanh').post(checkToken.checkToken, tblDMChiNhanh.deletetblDMChiNhanh);

    //  Quản lý nhân viên
    app.route('/qlnb/get_list_tbl_dmnhanvien').post(checkToken.checkToken, tblDMNhanvien.getListtblDMNhanvien);

    //  Quản lý loại tài sản
    app.route('/qlnb/add_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.addtblDMLoaiTaiSan);
    app.route('/qlnb/update_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.updatetblDMLoaiTaiSan);
    app.route('/qlnb/get_list_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.getListtblDMLoaiTaiSan);
    app.route('/qlnb/delete_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.deletetblDMLoaiTaiSan);
    app.route('/qlnb/get_list_name_tbl_dmloaitaisan').post(checkToken.checkToken, tblDMLoaiTaiSan.getListNametblDMLoaiTaiSan);

    // Danh mục tài sản
    app.route('/qlnb/add_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.addtblDMHangHoa);
    app.route('/qlnb/add_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.updatetblDMHangHoa);
    app.route('/qlnb/add_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.deleteRelationshiptblDMHangHoa);
    app.route('/qlnb/get_list_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListtblDMHangHoa);
    app.route('/qlnb/get_list_name_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListNametblDMHangHoa);

    //  Danh mục nhà cung cấp
    app.route('/qlnb/add_tbl_dmhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.addtblDMNhaCungCap);
    app.route('/qlnb/update_tbl_dmhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.updatetblDMNhaCungCap);
    app.route('/qlnb/delete_tbl_dmhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.deleteRelationshiptblDMNhaCungCap);
    app.route('/qlnb/get_list_tbl_dmhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.getListtblDMNhaCungCap);
    app.route('/qlnb/get_list_name_tbl_dmhacungcap').post(checkToken.checkToken, tblDMNhaCungCap.getListNametblDMNhaCungCap);

    //  Danh mục văn phòng phẩm
    app.route('/qlnb/add_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.addtblVanPhongPham);
    app.route('/qlnb/update_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.updatetblVanPhongPham);
    app.route('/qlnb/delete_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.deleteRelationshiptblVanPhongPham);
    app.route('/qlnb/get_list_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.getListtblVanPhongPham);
    app.route('/qlnb/get_list_name_tbl_vanphongpham').post(checkToken.checkToken, tblVanPhongPham.getListNametblVanPhongPham);


    //---------------------------------------------------------------- Menu yêu cầu mua sắm --------------------------------------------------------------------------------------
    // Đề nghị mua sắm
    app.route('/qlnb/add_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.addtblYeuCauMuaSam);
    app.route('/qlnb/update_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.updatetblYeuCauMuaSam);
    app.route('/qlnb/get_list_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.getListtblYeuCauMuaSam);
    app.route('/qlnb/delete_tbl_yeucaumuasam').post(checkToken.checkToken, tblYeuCauMuaSam.deletetblYeuCauMuaSam);
    // app.route('/qlnb/get_list_name_tbl_yeucaumuasam').post(checkToken.checkToken ,tblYeuCauMuaSam.getListNametblYeuCauMuaSam);

    // lấy name hang hoa
    app.route('/qlnb/get_list_name_tbl_dmhanghoa').post(checkToken.checkToken, tblDMHanghoa.getListNametblDMHangHoa);

    // lấy name nhân viên ---- dòng 24
    //---------------------------------------------------------------- Menu quản lý tài sản --------------------------------------------------------------------------------------

    app.route('/qlnb/add_tbl_taisan_bangiao').post(tblTaiSanBanGiao.addtblTaiSanBanGiao);
    app.route('/qlnb/update_tbl_taisan_bangiao').post(tblTaiSanBanGiao.updatetblTaiSanBanGiao);
    // app.route('/qlnb/get_list_tbl_taisan_bangiao').post(tblTaiSanBanGiao.deleteRelationshiptblTaiSanBanGiao);
    // app.route('/qlnb/get_list_tbl_taisan_bangiao').post(tblTaiSanBanGiao.addtblTaiSanBanGiao);



    app.route('/qlnb/add_tbl_TaiSanADD').post(tblTaiSan.addtblTaiSanADD);
    app.route('/qlnb/update_tbl_TaiSanADD').post(tblTaiSan.updatetblTaiSanADD);
    app.route('/qlnb/delete_tbl_TaiSanADD').post(tblTaiSan.deleteRelationshiptblTaiSanADD);
    app.route('/qlnb/get_list_tbl_TaiSanADD').post(tblTaiSan.getListtblTaiSanADD);
    app.route('/qlnb/get_list_tbl_TaiSan_ChuaSuDung').post(tblTaiSan.getListtblTaiSanChuaSuDung);
    app.route('/qlnb/get_list_tbl_TaiSan_TheoDoi').post(tblTaiSan.getListtblTaiSanTheoDoi);



    //---------------------------------------------------------------- Menu quản lý văn phòng phẩm --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.addTBLThemVPP);
    app.route('/qlnb/update_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.updateTBLThemVPP);
    app.route('/qlnb/delete_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.deleteRelationshipTBLThemVPP);
    app.route('/qlnb/get_list_tbl_them_vpp').post(tblThemVPP.getListTBLThemVPP);
    app.route('/qlnb/get_list_name_tbl_them_vpp').post(checkToken.checkToken, tblThemVPP.getListNameTBLThemVPP);

    // get list name NCC dòng 63

    //---------------------------------------------------------------- Menu đề nghị thanh toán --------------------------------------------------------------------------------------
    app.route('/qlnb/add_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.addtblDeNghiThanhToan);
    app.route('/qlnb/update_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.updatetblDeNghiThanhToan);
    app.route('/qlnb/delete_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.deleteRelationshiptblDeNghiThanhToan);
    app.route('/qlnb/get_list_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.getListtblDeNghiThanhToan);
    app.route('/qlnb/get_list_name_tbl_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.getListNametblDeNghiThanhToan);
    app.route('/qlnb/approval_denghi_thanhtoan').post(checkToken.checkToken, tblDeNghiThanhToan.approvalDeNghiThanhToan);
}