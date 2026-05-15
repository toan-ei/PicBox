export interface District {
  code: string
  name: string
}

export interface Province {
  code: string
  name: string
  districts: District[]
}

// 34 tỉnh/thành sau sáp nhập 1/7/2025
// Nguồn: Nghị quyết 202/2025/QH15
export const VIETNAM_PROVINCES: Province[] = [
  // ===== 6 THÀNH PHỐ TRỰC THUỘC TRUNG ƯƠNG =====
  {
    code: 'HN', name: 'TP. Hà Nội', // Giữ nguyên
    districts: [
      { code: 'HN-HK', name: 'Hoàn Kiếm' },
      { code: 'HN-DK', name: 'Đống Đa' },
      { code: 'HN-BB', name: 'Ba Đình' },
      { code: 'HN-HBT', name: 'Hai Bà Trưng' },
      { code: 'HN-TX', name: 'Thanh Xuân' },
      { code: 'HN-CG', name: 'Cầu Giấy' },
      { code: 'HN-LB', name: 'Long Biên' },
      { code: 'HN-HM', name: 'Hoàng Mai' },
      { code: 'HN-BTL', name: 'Bắc Từ Liêm' },
      { code: 'HN-NTL', name: 'Nam Từ Liêm' },
      { code: 'HN-TH', name: 'Tây Hồ' },
      { code: 'HN-HD', name: 'Hà Đông' },
      { code: 'HN-ST', name: 'Sơn Tây' },
      { code: 'HN-ME', name: 'Mê Linh' },
      { code: 'HN-DA', name: 'Đông Anh' },
      { code: 'HN-GL', name: 'Gia Lâm' },
      { code: 'HN-SS', name: 'Sóc Sơn' },
      { code: 'HN-HH', name: 'Hoài Đức' },
      { code: 'HN-DD', name: 'Đan Phượng' },
      { code: 'HN-TT', name: 'Thanh Trì' },
      { code: 'HN-CM', name: 'Chương Mỹ' },
      { code: 'HN-TM', name: 'Thường Tín' },
      { code: 'HN-QO', name: 'Quốc Oai' },
      { code: 'HN-TT2', name: 'Thạch Thất' },
      { code: 'HN-PX', name: 'Phú Xuyên' },
      { code: 'HN-UH', name: 'Ứng Hòa' },
      { code: 'HN-MD', name: 'Mỹ Đức' },
      { code: 'HN-BV', name: 'Ba Vì' },
      { code: 'HN-PT', name: 'Phúc Thọ' },
    ]
  },
  {
    code: 'HUE', name: 'TP. Huế', // Giữ nguyên
    districts: [
      { code: 'HUE-PH', name: 'Phú Hội' },
      { code: 'HUE-PD', name: 'Phú Định' },
      { code: 'HUE-TV', name: 'Thuận Vinh' },
      { code: 'HUE-AN', name: 'An Hòa' },
      { code: 'HUE-HT', name: 'Hương Thủy' },
      { code: 'HUE-HH', name: 'Hương Hồ' },
      { code: 'HUE-PD2', name: 'Phong Điền' },
      { code: 'HUE-QD', name: 'Quảng Điền' },
      { code: 'HUE-PV', name: 'Phú Vang' },
      { code: 'HUE-PL', name: 'Phú Lộc' },
      { code: 'HUE-AL', name: 'A Lưới' },
      { code: 'HUE-ND', name: 'Nam Đông' },
    ]
  },
  {
    code: 'HCM', name: 'TP. Hồ Chí Minh', // Mở rộng: + Bình Dương + Bà Rịa-Vũng Tàu
    districts: [
      { code: 'HCM-Q1', name: 'Quận 1' },
      { code: 'HCM-Q3', name: 'Quận 3' },
      { code: 'HCM-Q4', name: 'Quận 4' },
      { code: 'HCM-Q5', name: 'Quận 5' },
      { code: 'HCM-Q6', name: 'Quận 6' },
      { code: 'HCM-Q7', name: 'Quận 7' },
      { code: 'HCM-Q8', name: 'Quận 8' },
      { code: 'HCM-Q10', name: 'Quận 10' },
      { code: 'HCM-Q11', name: 'Quận 11' },
      { code: 'HCM-Q12', name: 'Quận 12' },
      { code: 'HCM-BTH', name: 'Bình Thạnh' },
      { code: 'HCM-BT', name: 'Bình Tân' },
      { code: 'HCM-TB', name: 'Tân Bình' },
      { code: 'HCM-TP', name: 'Tân Phú' },
      { code: 'HCM-GV', name: 'Gò Vấp' },
      { code: 'HCM-PN', name: 'Phú Nhuận' },
      { code: 'HCM-TD', name: 'TP. Thủ Đức' },
      { code: 'HCM-BC', name: 'Bình Chánh' },
      { code: 'HCM-CC', name: 'Củ Chi' },
      { code: 'HCM-HM', name: 'Hóc Môn' },
      { code: 'HCM-NB', name: 'Nhà Bè' },
      { code: 'HCM-CG', name: 'Cần Giờ' },
      // Vùng Bình Dương (sáp nhập)
      { code: 'HCM-TDM', name: 'Thủ Dầu Một (Bình Dương)' },
      { code: 'HCM-TA', name: 'Thuận An (Bình Dương)' },
      { code: 'HCM-DA', name: 'Dĩ An (Bình Dương)' },
      { code: 'HCM-BCA', name: 'Bến Cát (Bình Dương)' },
      { code: 'HCM-TNU', name: 'Tân Uyên (Bình Dương)' },
      { code: 'HCM-BBB', name: 'Bàu Bàng (Bình Dương)' },
      { code: 'HCM-DT', name: 'Dầu Tiếng (Bình Dương)' },
      { code: 'HCM-PG', name: 'Phú Giáo (Bình Dương)' },
      // Vùng Bà Rịa - Vũng Tàu (sáp nhập)
      { code: 'HCM-VT', name: 'TP. Vũng Tàu (BR-VT)' },
      { code: 'HCM-BR', name: 'TP. Bà Rịa (BR-VT)' },
      { code: 'HCM-PM', name: 'Phú Mỹ (BR-VT)' },
      { code: 'HCM-XM', name: 'Xuyên Mộc (BR-VT)' },
      { code: 'HCM-CD', name: 'Châu Đức (BR-VT)' },
      { code: 'HCM-LD', name: 'Long Điền (BR-VT)' },
      { code: 'HCM-DD', name: 'Đất Đỏ (BR-VT)' },
    ]
  },
  {
    code: 'HP', name: 'TP. Hải Phòng', // Mở rộng: + Hải Dương
    districts: [
      { code: 'HP-HB', name: 'Hồng Bàng' },
      { code: 'HP-NQ', name: 'Ngô Quyền' },
      { code: 'HP-LC', name: 'Lê Chân' },
      { code: 'HP-KA', name: 'Kiến An' },
      { code: 'HP-DS', name: 'Đồ Sơn' },
      { code: 'HP-DK', name: 'Dương Kinh' },
      { code: 'HP-HA', name: 'Hải An' },
      { code: 'HP-AD', name: 'An Dương' },
      { code: 'HP-AL', name: 'An Lão' },
      { code: 'HP-KT', name: 'Kiến Thụy' },
      { code: 'HP-TL', name: 'Tiên Lãng' },
      { code: 'HP-VB', name: 'Vĩnh Bảo' },
      { code: 'HP-CH', name: 'Cát Hải' },
      // Vùng Hải Dương (sáp nhập)
      { code: 'HP-HD', name: 'TP. Hải Dương' },
      { code: 'HP-CL', name: 'Chí Linh (Hải Dương)' },
      { code: 'HP-KM', name: 'Kinh Môn (Hải Dương)' },
      { code: 'HP-BG', name: 'Bình Giang (Hải Dương)' },
      { code: 'HP-CG2', name: 'Cẩm Giàng (Hải Dương)' },
      { code: 'HP-GL', name: 'Gia Lộc (Hải Dương)' },
      { code: 'HP-NS', name: 'Nam Sách (Hải Dương)' },
      { code: 'HP-NG', name: 'Ninh Giang (Hải Dương)' },
      { code: 'HP-THA', name: 'Thanh Hà (Hải Dương)' },
      { code: 'HP-TM', name: 'Thanh Miện (Hải Dương)' },
      { code: 'HP-TK', name: 'Tứ Kỳ (Hải Dương)' },
    ]
  },
  {
    code: 'DN', name: 'TP. Đà Nẵng', // Mở rộng: + Quảng Nam
    districts: [
      { code: 'DN-HC', name: 'Hải Châu' },
      { code: 'DN-TK', name: 'Thanh Khê' },
      { code: 'DN-ST', name: 'Sơn Trà' },
      { code: 'DN-NHS', name: 'Ngũ Hành Sơn' },
      { code: 'DN-LC', name: 'Liên Chiểu' },
      { code: 'DN-CL', name: 'Cẩm Lệ' },
      { code: 'DN-HV', name: 'Hòa Vang' },
      // Vùng Quảng Nam (sáp nhập)
      { code: 'DN-TK2', name: 'TP. Tam Kỳ (Quảng Nam)' },
      { code: 'DN-HA', name: 'TP. Hội An (Quảng Nam)' },
      { code: 'DN-DB', name: 'TX. Điện Bàn (Quảng Nam)' },
      { code: 'DN-DX', name: 'Duy Xuyên (Quảng Nam)' },
      { code: 'DN-TB', name: 'Thăng Bình (Quảng Nam)' },
      { code: 'DN-QS', name: 'Quế Sơn (Quảng Nam)' },
      { code: 'DN-DL', name: 'Đại Lộc (Quảng Nam)' },
      { code: 'DN-TP', name: 'Tiên Phước (Quảng Nam)' },
      { code: 'DN-HS', name: 'Hiệp Đức (Quảng Nam)' },
      { code: 'DN-NS', name: 'Nông Sơn (Quảng Nam)' },
      { code: 'DN-NM', name: 'Nam Giang (Quảng Nam)' },
      { code: 'DN-TG', name: 'Tây Giang (Quảng Nam)' },
      { code: 'DN-DG', name: 'Đông Giang (Quảng Nam)' },
      { code: 'DN-PS', name: 'Phước Sơn (Quảng Nam)' },
      { code: 'DN-BTM', name: 'Bắc Trà My (Quảng Nam)' },
      { code: 'DN-NTM', name: 'Nam Trà My (Quảng Nam)' },
    ]
  },
  {
    code: 'CT', name: 'TP. Cần Thơ', // Mở rộng: + Sóc Trăng + Hậu Giang
    districts: [
      { code: 'CT-NK', name: 'Ninh Kiều' },
      { code: 'CT-BT', name: 'Bình Thủy' },
      { code: 'CT-CR', name: 'Cái Răng' },
      { code: 'CT-OM', name: 'Ô Môn' },
      { code: 'CT-TN', name: 'Thốt Nốt' },
      { code: 'CT-VT', name: 'Vĩnh Thạnh' },
      { code: 'CT-CD', name: 'Cờ Đỏ' },
      { code: 'CT-PD', name: 'Phong Điền' },
      { code: 'CT-TL', name: 'Thới Lai' },
      // Vùng Sóc Trăng (sáp nhập)
      { code: 'CT-ST', name: 'TP. Sóc Trăng' },
      { code: 'CT-VC', name: 'TX. Vĩnh Châu (ST)' },
      { code: 'CT-NN', name: 'TX. Ngã Năm (ST)' },
      { code: 'CT-CTC', name: 'Châu Thành (ST)' },
      { code: 'CT-KS', name: 'Kế Sách (ST)' },
      { code: 'CT-MT', name: 'Mỹ Tú (ST)' },
      { code: 'CT-CLd', name: 'Cù Lao Dung (ST)' },
      { code: 'CT-LM', name: 'Long Mỹ (ST)' },
      { code: 'CT-TT', name: 'Thạnh Trị (ST)' },
      { code: 'CT-MX', name: 'Mỹ Xuyên (ST)' },
      // Vùng Hậu Giang (sáp nhập)
      { code: 'CT-VTH', name: 'TP. Vị Thanh (HG)' },
      { code: 'CT-NB', name: 'TX. Ngã Bảy (HG)' },
      { code: 'CT-LMH', name: 'TX. Long Mỹ (HG)' },
      { code: 'CT-CTH', name: 'Châu Thành (HG)' },
      { code: 'CT-CTA', name: 'Châu Thành A (HG)' },
      { code: 'CT-PH', name: 'Phụng Hiệp (HG)' },
      { code: 'CT-VH', name: 'Vị Thủy (HG)' },
    ]
  },

  // ===== 28 TỈNH =====
  // --- Giữ nguyên (11) ---
  {
    code: 'HT', name: 'Hà Tĩnh',
    districts: [
      { code: 'HT-HT', name: 'TP. Hà Tĩnh' },
      { code: 'HT-HL', name: 'TX. Hồng Lĩnh' },
      { code: 'HT-KA', name: 'TX. Kỳ Anh' },
      { code: 'HT-CL', name: 'Can Lộc' },
      { code: 'HT-DX', name: 'Đức Thọ' },
      { code: 'HT-HK', name: 'Hương Khê' },
      { code: 'HT-HS', name: 'Hương Sơn' },
      { code: 'HT-LH', name: 'Lộc Hà' },
      { code: 'HT-NX', name: 'Nghi Xuân' },
      { code: 'HT-TH', name: 'Thạch Hà' },
      { code: 'HT-VQ', name: 'Vũ Quang' },
    ]
  },
  {
    code: 'NA', name: 'Nghệ An',
    districts: [
      { code: 'NA-V', name: 'TP. Vinh' },
      { code: 'NA-CL', name: 'TX. Cửa Lò' },
      { code: 'NA-TH', name: 'TX. Thái Hòa' },
      { code: 'NA-HM', name: 'TX. Hoàng Mai' },
      { code: 'NA-AS', name: 'Anh Sơn' },
      { code: 'NA-CC', name: 'Con Cuông' },
      { code: 'NA-DL', name: 'Đô Lương' },
      { code: 'NA-DC', name: 'Diễn Châu' },
      { code: 'NA-HN', name: 'Hưng Nguyên' },
      { code: 'NA-KS', name: 'Kỳ Sơn' },
      { code: 'NA-ND', name: 'Nam Đàn' },
      { code: 'NA-NL', name: 'Nghi Lộc' },
      { code: 'NA-NDA', name: 'Nghĩa Đàn' },
      { code: 'NA-QP', name: 'Quế Phong' },
      { code: 'NA-QC', name: 'Quỳ Châu' },
      { code: 'NA-QH', name: 'Quỳ Hợp' },
      { code: 'NA-QL', name: 'Quỳnh Lưu' },
      { code: 'NA-TK', name: 'Tân Kỳ' },
      { code: 'NA-TC', name: 'Thanh Chương' },
      { code: 'NA-TD', name: 'Tương Dương' },
      { code: 'NA-YT', name: 'Yên Thành' },
    ]
  },
  {
    code: 'TH', name: 'Thanh Hóa',
    districts: [
      { code: 'TH-TH', name: 'TP. Thanh Hóa' },
      { code: 'TH-BS', name: 'TP. Bỉm Sơn' },
      { code: 'TH-SS', name: 'TX. Sầm Sơn' },
      { code: 'TH-NS', name: 'TX. Nghi Sơn' },
      { code: 'TH-BT', name: 'Bá Thước' },
      { code: 'TH-CT', name: 'Cẩm Thủy' },
      { code: 'TH-DS', name: 'Đông Sơn' },
      { code: 'TH-HT', name: 'Hà Trung' },
      { code: 'TH-HL', name: 'Hậu Lộc' },
      { code: 'TH-HH', name: 'Hoằng Hóa' },
      { code: 'TH-LC', name: 'Lang Chánh' },
      { code: 'TH-ML', name: 'Mường Lát' },
      { code: 'TH-NG', name: 'Nga Sơn' },
      { code: 'TH-NL', name: 'Ngọc Lặc' },
      { code: 'TH-NTH', name: 'Như Thanh' },
      { code: 'TH-NX', name: 'Như Xuân' },
      { code: 'TH-NC', name: 'Nông Cống' },
      { code: 'TH-QH', name: 'Quan Hóa' },
      { code: 'TH-QS', name: 'Quan Sơn' },
      { code: 'TH-QX', name: 'Quảng Xương' },
      { code: 'TH-TT', name: 'Thạch Thành' },
      { code: 'TH-TH2', name: 'Thiệu Hóa' },
      { code: 'TH-TX', name: 'Thọ Xuân' },
      { code: 'TH-TX2', name: 'Thường Xuân' },
      { code: 'TH-TS', name: 'Triệu Sơn' },
      { code: 'TH-VL', name: 'Vĩnh Lộc' },
      { code: 'TH-YD', name: 'Yên Định' },
    ]
  },
  {
    code: 'QN2', name: 'Quảng Ninh',
    districts: [
      { code: 'QN2-HL', name: 'TP. Hạ Long' },
      { code: 'QN2-MC', name: 'TP. Móng Cái' },
      { code: 'QN2-CP', name: 'TP. Cẩm Phả' },
      { code: 'QN2-UB', name: 'TP. Uông Bí' },
      { code: 'QN2-QY', name: 'TX. Quảng Yên' },
      { code: 'QN2-DT', name: 'TX. Đông Triều' },
      { code: 'QN2-BL', name: 'Bình Liêu' },
      { code: 'QN2-HH', name: 'Hải Hà' },
      { code: 'QN2-DH', name: 'Đầm Hà' },
      { code: 'QN2-TY', name: 'Tiên Yên' },
      { code: 'QN2-VD', name: 'Vân Đồn' },
      { code: 'QN2-BC', name: 'Ba Chẽ' },
      { code: 'QN2-CT', name: 'Cô Tô' },
    ]
  },
  {
    code: 'SL', name: 'Sơn La',
    districts: [
      { code: 'SL-SL', name: 'TP. Sơn La' },
      { code: 'SL-BY', name: 'Bắc Yên' },
      { code: 'SL-MC', name: 'Mộc Châu' },
      { code: 'SL-ML', name: 'Mường La' },
      { code: 'SL-PY', name: 'Phù Yên' },
      { code: 'SL-QN', name: 'Quỳnh Nhai' },
      { code: 'SL-TC', name: 'Thuận Châu' },
      { code: 'SL-VH', name: 'Vân Hồ' },
      { code: 'SL-YC', name: 'Yên Châu' },
    ]
  },
  {
    code: 'DB', name: 'Điện Biên',
    districts: [
      { code: 'DB-DBP', name: 'TP. Điện Biên Phủ' },
      { code: 'DB-ML', name: 'TX. Mường Lay' },
      { code: 'DB-DB', name: 'Điện Biên' },
      { code: 'DB-DBD', name: 'Điện Biên Đông' },
      { code: 'DB-MA', name: 'Mường Ảng' },
      { code: 'DB-MN', name: 'Mường Nhé' },
      { code: 'DB-NP', name: 'Nậm Pồ' },
      { code: 'DB-TC', name: 'Tủa Chùa' },
      { code: 'DB-TG', name: 'Tuần Giáo' },
    ]
  },
  {
    code: 'LC', name: 'Lai Châu',
    districts: [
      { code: 'LC-LC', name: 'TP. Lai Châu' },
      { code: 'LC-MT', name: 'Mường Tè' },
      { code: 'LC-NN', name: 'Nậm Nhùn' },
      { code: 'LC-PT', name: 'Phong Thổ' },
      { code: 'LC-SH', name: 'Sìn Hồ' },
      { code: 'LC-TD', name: 'Tam Đường' },
      { code: 'LC-TU', name: 'Tân Uyên' },
      { code: 'LC-TUY', name: 'Than Uyên' },
    ]
  },
  {
    code: 'LS', name: 'Lạng Sơn',
    districts: [
      { code: 'LS-LS', name: 'TP. Lạng Sơn' },
      { code: 'LS-BS', name: 'Bắc Sơn' },
      { code: 'LS-BG', name: 'Bình Gia' },
      { code: 'LS-CL', name: 'Cao Lộc' },
      { code: 'LS-CLA', name: 'Chi Lăng' },
      { code: 'LS-DL', name: 'Đình Lập' },
      { code: 'LS-HL', name: 'Hữu Lũng' },
      { code: 'LS-LB', name: 'Lộc Bình' },
      { code: 'LS-TD', name: 'Tràng Định' },
      { code: 'LS-VQ', name: 'Văn Quan' },
      { code: 'LS-VL', name: 'Văn Lãng' },
    ]
  },
  {
    code: 'CB', name: 'Cao Bằng',
    districts: [
      { code: 'CB-CB', name: 'TP. Cao Bằng' },
      { code: 'CB-BL', name: 'Bảo Lạc' },
      { code: 'CB-BLA', name: 'Bảo Lâm' },
      { code: 'CB-HQ', name: 'Hà Quảng' },
      { code: 'CB-HL', name: 'Hạ Lang' },
      { code: 'CB-HA', name: 'Hòa An' },
      { code: 'CB-NB', name: 'Nguyên Bình' },
      { code: 'CB-QH', name: 'Quảng Hòa' },
      { code: 'CB-TA', name: 'Thạch An' },
      { code: 'CB-TK', name: 'Trùng Khánh' },
    ]
  },

  // --- Tỉnh mới sau sáp nhập (19) ---
  {
    code: 'TQ', name: 'Tuyên Quang', // Tuyên Quang + Hà Giang
    districts: [
      { code: 'TQ-TQ', name: 'TP. Tuyên Quang' },
      { code: 'TQ-CH', name: 'Chiêm Hóa' },
      { code: 'TQ-HY', name: 'Hàm Yên' },
      { code: 'TQ-LB', name: 'Lâm Bình' },
      { code: 'TQ-NH', name: 'Na Hang' },
      { code: 'TQ-SD', name: 'Sơn Dương' },
      { code: 'TQ-YS', name: 'Yên Sơn' },
      // Hà Giang
      { code: 'TQ-HG', name: 'TP. Hà Giang' },
      { code: 'TQ-BM', name: 'Bắc Mê' },
      { code: 'TQ-BQG', name: 'Bắc Quang' },
      { code: 'TQ-DV', name: 'Đồng Văn' },
      { code: 'TQ-HSP', name: 'Hoàng Su Phì' },
      { code: 'TQ-MV', name: 'Mèo Vạc' },
      { code: 'TQ-QB', name: 'Quản Bạ' },
      { code: 'TQ-QBG', name: 'Quang Bình' },
      { code: 'TQ-VX', name: 'Vị Xuyên' },
      { code: 'TQ-XM', name: 'Xín Mần' },
      { code: 'TQ-YM', name: 'Yên Minh' },
    ]
  },
  {
    code: 'LC2', name: 'Lào Cai', // Lào Cai + Yên Bái
    districts: [
      { code: 'LC2-LC', name: 'TP. Lào Cai' },
      { code: 'LC2-SP', name: 'TX. Sa Pa' },
      { code: 'LC2-BX', name: 'Bát Xát' },
      { code: 'LC2-MK', name: 'Mường Khương' },
      { code: 'LC2-SM', name: 'Si Ma Cai' },
      { code: 'LC2-BT', name: 'Bảo Thắng' },
      { code: 'LC2-BY', name: 'Bảo Yên' },
      { code: 'LC2-VB', name: 'Văn Bàn' },
      // Yên Bái
      { code: 'LC2-YB', name: 'TP. Yên Bái' },
      { code: 'LC2-NL', name: 'TX. Nghĩa Lộ' },
      { code: 'LC2-LY', name: 'Lục Yên' },
      { code: 'LC2-MC', name: 'Mù Căng Chải' },
      { code: 'LC2-TT', name: 'Trạm Tấu' },
      { code: 'LC2-TY', name: 'Trấn Yên' },
      { code: 'LC2-VC', name: 'Văn Chấn' },
      { code: 'LC2-VY', name: 'Văn Yên' },
      { code: 'LC2-YBN', name: 'Yên Bình' },
    ]
  },
  {
    code: 'TN', name: 'Thái Nguyên', // Thái Nguyên + Bắc Kạn
    districts: [
      { code: 'TN-TN', name: 'TP. Thái Nguyên' },
      { code: 'TN-SC', name: 'TX. Sông Công' },
      { code: 'TN-PY', name: 'TX. Phổ Yên' },
      { code: 'TN-DT', name: 'Đại Từ' },
      { code: 'TN-DH', name: 'Định Hóa' },
      { code: 'TN-DY', name: 'Đồng Hỷ' },
      { code: 'TN-PB', name: 'Phú Bình' },
      { code: 'TN-PL', name: 'Phú Lương' },
      { code: 'TN-VN', name: 'Võ Nhai' },
      // Bắc Kạn
      { code: 'TN-BK', name: 'TP. Bắc Kạn' },
      { code: 'TN-BB', name: 'Ba Bể' },
      { code: 'TN-BTO', name: 'Bạch Thông' },
      { code: 'TN-CD', name: 'Chợ Đồn' },
      { code: 'TN-CM', name: 'Chợ Mới' },
      { code: 'TN-NR', name: 'Na Rì' },
      { code: 'TN-NS', name: 'Ngân Sơn' },
      { code: 'TN-PN', name: 'Pác Nặm' },
    ]
  },
  {
    code: 'PT', name: 'Phú Thọ', // Phú Thọ + Hòa Bình + Vĩnh Phúc
    districts: [
      { code: 'PT-VT', name: 'TP. Việt Trì' },
      { code: 'PT-PT', name: 'TX. Phú Thọ' },
      { code: 'PT-CK', name: 'Cẩm Khê' },
      { code: 'PT-DH', name: 'Đoan Hùng' },
      { code: 'PT-HH', name: 'Hạ Hòa' },
      { code: 'PT-LT', name: 'Lâm Thao' },
      { code: 'PT-PN', name: 'Phù Ninh' },
      { code: 'PT-TN', name: 'Tam Nông' },
      { code: 'PT-TS', name: 'Tân Sơn' },
      { code: 'PT-TB', name: 'Thanh Ba' },
      { code: 'PT-TSO', name: 'Thanh Sơn' },
      { code: 'PT-TTH', name: 'Thanh Thủy' },
      { code: 'PT-YL', name: 'Yên Lập' },
      // Hòa Bình
      { code: 'PT-HB', name: 'TP. Hòa Bình' },
      { code: 'PT-LS', name: 'TX. Lương Sơn' },
      { code: 'PT-CP', name: 'Cao Phong' },
      { code: 'PT-DB', name: 'Đà Bắc' },
      { code: 'PT-KB', name: 'Kim Bôi' },
      { code: 'PT-LSO', name: 'Lạc Sơn' },
      { code: 'PT-LTH', name: 'Lạc Thủy' },
      { code: 'PT-MC', name: 'Mai Châu' },
      { code: 'PT-TL', name: 'Tân Lạc' },
      { code: 'PT-YT', name: 'Yên Thủy' },
      // Vĩnh Phúc
      { code: 'PT-VY', name: 'TP. Vĩnh Yên' },
      { code: 'PT-PY', name: 'TX. Phúc Yên' },
      { code: 'PT-BX', name: 'Bình Xuyên' },
      { code: 'PT-LTH2', name: 'Lập Thạch' },
      { code: 'PT-SL', name: 'Sông Lô' },
      { code: 'PT-TDG', name: 'Tam Dương' },
      { code: 'PT-TDA', name: 'Tam Đảo' },
      { code: 'PT-VTG', name: 'Vĩnh Tường' },
      { code: 'PT-YLA', name: 'Yên Lạc' },
    ]
  },
  {
    code: 'BN', name: 'Bắc Ninh', // Bắc Ninh + Hưng Yên
    districts: [
      { code: 'BN-BN', name: 'TP. Bắc Ninh' },
      { code: 'BN-TS', name: 'TX. Từ Sơn' },
      { code: 'BN-GB', name: 'Gia Bình' },
      { code: 'BN-LT', name: 'Lương Tài' },
      { code: 'BN-QV', name: 'Quế Võ' },
      { code: 'BN-TTH', name: 'Thuận Thành' },
      { code: 'BN-TD', name: 'Tiên Du' },
      { code: 'BN-YP', name: 'Yên Phong' },
      // Hưng Yên
      { code: 'BN-HY', name: 'TP. Hưng Yên' },
      { code: 'BN-MH', name: 'TX. Mỹ Hào' },
      { code: 'BN-AT', name: 'Ân Thi' },
      { code: 'BN-KC', name: 'Khoái Châu' },
      { code: 'BN-KD', name: 'Kim Động' },
      { code: 'BN-PC', name: 'Phù Cừ' },
      { code: 'BN-TLU', name: 'Tiên Lữ' },
      { code: 'BN-VG', name: 'Văn Giang' },
      { code: 'BN-VLA', name: 'Văn Lâm' },
      { code: 'BN-YM', name: 'Yên Mỹ' },
    ]
  },
  {
    code: 'HP2', name: 'Hải Phòng (Thái Bình)', // Thêm Thái Bình vào Hải Phòng theo NQ
    districts: [
      { code: 'HP2-TB', name: 'TP. Thái Bình' },
      { code: 'HP2-DH', name: 'Đông Hưng' },
      { code: 'HP2-HH', name: 'Hưng Hà' },
      { code: 'HP2-KX', name: 'Kiến Xương' },
      { code: 'HP2-QP', name: 'Quỳnh Phụ' },
      { code: 'HP2-TT', name: 'Thái Thụy' },
      { code: 'HP2-TH', name: 'Tiền Hải' },
      { code: 'HP2-VT', name: 'Vũ Thư' },
    ]
  },
  {
    code: 'NB', name: 'Ninh Bình', // Ninh Bình + Hà Nam + Nam Định
    districts: [
      { code: 'NB-NB', name: 'TP. Ninh Bình' },
      { code: 'NB-TD', name: 'TP. Tam Điệp' },
      { code: 'NB-GV', name: 'Gia Viễn' },
      { code: 'NB-HL', name: 'Hoa Lư' },
      { code: 'NB-KS', name: 'Kim Sơn' },
      { code: 'NB-NQ', name: 'Nho Quan' },
      { code: 'NB-YK', name: 'Yên Khánh' },
      { code: 'NB-YM', name: 'Yên Mô' },
      // Hà Nam
      { code: 'NB-PL', name: 'TP. Phủ Lý (Hà Nam)' },
      { code: 'NB-DT', name: 'TX. Duy Tiên (Hà Nam)' },
      { code: 'NB-BL', name: 'Bình Lục (Hà Nam)' },
      { code: 'NB-LN', name: 'Lý Nhân (Hà Nam)' },
      { code: 'NB-TL', name: 'Thanh Liêm (Hà Nam)' },
      // Nam Định
      { code: 'NB-ND', name: 'TP. Nam Định' },
      { code: 'NB-GT', name: 'Giao Thủy (NĐ)' },
      { code: 'NB-HH', name: 'Hải Hậu (NĐ)' },
      { code: 'NB-ML', name: 'Mỹ Lộc (NĐ)' },
      { code: 'NB-NTR', name: 'Nam Trực (NĐ)' },
      { code: 'NB-NGH', name: 'Nghĩa Hưng (NĐ)' },
      { code: 'NB-TRN', name: 'Trực Ninh (NĐ)' },
      { code: 'NB-VB', name: 'Vụ Bản (NĐ)' },
      { code: 'NB-XT', name: 'Xuân Trường (NĐ)' },
      { code: 'NB-YN', name: 'Ý Yên (NĐ)' },
    ]
  },
  {
    code: 'QT', name: 'Quảng Trị', // Quảng Trị + Quảng Bình
    districts: [
      { code: 'QT-DH', name: 'TP. Đông Hà' },
      { code: 'QT-QT', name: 'TX. Quảng Trị' },
      { code: 'QT-VL', name: 'Vĩnh Linh' },
      { code: 'QT-GL', name: 'Gio Linh' },
      { code: 'QT-HL', name: 'Hải Lăng' },
      { code: 'QT-CL', name: 'Cam Lộ' },
      { code: 'QT-TP', name: 'Triệu Phong' },
      { code: 'QT-DK', name: 'Đa Krông' },
      { code: 'QT-HH', name: 'Hướng Hóa' },
      // Quảng Bình
      { code: 'QT-DH2', name: 'TP. Đồng Hới (QB)' },
      { code: 'QT-BD', name: 'TX. Ba Đồn (QB)' },
      { code: 'QT-MH', name: 'Minh Hóa (QB)' },
      { code: 'QT-TH', name: 'Tuyên Hóa (QB)' },
      { code: 'QT-QT2', name: 'Quảng Trạch (QB)' },
      { code: 'QT-BT', name: 'Bố Trạch (QB)' },
      { code: 'QT-QNH', name: 'Quảng Ninh (QB)' },
      { code: 'QT-LT', name: 'Lệ Thủy (QB)' },
    ]
  },
  {
    code: 'QNG', name: 'Quảng Ngãi', // Quảng Ngãi + Kon Tum
    districts: [
      { code: 'QNG-QN', name: 'TP. Quảng Ngãi' },
      { code: 'QNG-DP', name: 'TX. Đức Phổ' },
      { code: 'QNG-MD', name: 'TX. Mộ Đức' },
      { code: 'QNG-BT', name: 'Ba Tơ' },
      { code: 'QNG-BJ', name: 'Bình Sơn' },
      { code: 'QNG-ML', name: 'Minh Long' },
      { code: 'QNG-NH', name: 'Nghĩa Hành' },
      { code: 'QNG-SH', name: 'Sơn Hà' },
      { code: 'QNG-ST', name: 'Sơn Tây' },
      { code: 'QNG-STN', name: 'Sơn Tịnh' },
      { code: 'QNG-TN', name: 'Tư Nghĩa' },
      { code: 'QNG-TB', name: 'Trà Bồng' },
      { code: 'QNG-LS', name: 'Lý Sơn' },
      // Kon Tum
      { code: 'QNG-KT', name: 'TP. Kon Tum' },
      { code: 'QNG-DG', name: 'Đắk Glei (KT)' },
      { code: 'QNG-NH2', name: 'Ngọc Hồi (KT)' },
      { code: 'QNG-DH', name: 'Đắk Hà (KT)' },
      { code: 'QNG-DT', name: 'Đắk Tô (KT)' },
      { code: 'QNG-KP', name: 'Kon Plông (KT)' },
      { code: 'QNG-KR', name: 'Kon Rẫy (KT)' },
      { code: 'QNG-ST2', name: 'Sa Thầy (KT)' },
      { code: 'QNG-TMR', name: 'Tu Mơ Rông (KT)' },
      { code: 'QNG-IH', name: "Ia H'Drai (KT)" },
    ]
  },
  {
    code: 'GL', name: 'Gia Lai', // Gia Lai + Bình Định
    districts: [
      { code: 'GL-PL', name: 'TP. Pleiku' },
      { code: 'GL-AK', name: 'TX. An Khê' },
      { code: 'GL-AY', name: 'TX. Ayun Pa' },
      { code: 'GL-CS', name: 'Chư Sê' },
      { code: 'GL-CP', name: 'Chư Pưh' },
      { code: 'GL-CPR', name: 'Chư Prông' },
      { code: 'GL-DP', name: 'Đắk Pơ' },
      { code: 'GL-DC', name: 'Đức Cơ' },
      { code: 'GL-IG', name: 'Ia Grai' },
      { code: 'GL-KB', name: 'KBang' },
      { code: 'GL-KC', name: 'Kông Chro' },
      { code: 'GL-MY', name: 'Mang Yang' },
      { code: 'GL-PT', name: 'Phú Thiện' },
      // Bình Định
      { code: 'GL-QN', name: 'TP. Quy Nhơn (BĐ)' },
      { code: 'GL-AN', name: 'TX. An Nhơn (BĐ)' },
      { code: 'GL-HN', name: 'TX. Hoài Nhơn (BĐ)' },
      { code: 'GL-TP', name: 'Tuy Phước (BĐ)' },
      { code: 'GL-VC', name: 'Vân Canh (BĐ)' },
      { code: 'GL-TS', name: 'Tây Sơn (BĐ)' },
      { code: 'GL-VT', name: 'Vĩnh Thạnh (BĐ)' },
      { code: 'GL-AL', name: 'An Lão (BĐ)' },
      { code: 'GL-PC', name: 'Phù Cát (BĐ)' },
      { code: 'GL-PM', name: 'Phù Mỹ (BĐ)' },
      { code: 'GL-HA', name: 'Hoài Ân (BĐ)' },
    ]
  },
  {
    code: 'PY', name: 'Phú Yên', // Phú Yên + Ninh Thuận
    districts: [
      { code: 'PY-TH', name: 'TP. Tuy Hòa' },
      { code: 'PY-SC', name: 'TX. Sông Cầu' },
      { code: 'PY-DH', name: 'TX. Đông Hòa' },
      { code: 'PY-PH', name: 'Phú Hòa' },
      { code: 'PY-TH2', name: 'Tây Hòa' },
      { code: 'PY-TA', name: 'Tuy An' },
      { code: 'PY-SH', name: 'Sơn Hòa' },
      { code: 'PY-SHI', name: 'Sông Hinh' },
      { code: 'PY-DX', name: 'Đồng Xuân' },
      // Ninh Thuận
      { code: 'PY-PR', name: 'TP. Phan Rang-Tháp Chàm (NT)' },
      { code: 'PY-BA', name: 'Bác Ái (NT)' },
      { code: 'PY-NH', name: 'Ninh Hải (NT)' },
      { code: 'PY-NP', name: 'Ninh Phước (NT)' },
      { code: 'PY-NS', name: 'Ninh Sơn (NT)' },
      { code: 'PY-TB', name: 'Thuận Bắc (NT)' },
      { code: 'PY-TN', name: 'Thuận Nam (NT)' },
    ]
  },
  {
    code: 'KH', name: 'Khánh Hòa', // Khánh Hòa + Lâm Đồng + Đắk Nông (theo NQ)
    districts: [
      { code: 'KH-NT', name: 'TP. Nha Trang' },
      { code: 'KH-CR', name: 'TP. Cam Ranh' },
      { code: 'KH-NH', name: 'TX. Ninh Hòa' },
      { code: 'KH-DK', name: 'Diên Khánh' },
      { code: 'KH-KV', name: 'Khánh Vĩnh' },
      { code: 'KH-KS', name: 'Khánh Sơn' },
      { code: 'KH-VN', name: 'Vạn Ninh' },
      { code: 'KH-TS', name: 'Trường Sa' },
    ]
  },
  {
    code: 'LDG', name: 'Lâm Đồng', // Lâm Đồng + Bình Thuận + Đắk Nông
    districts: [
      { code: 'LDG-DL', name: 'TP. Đà Lạt' },
      { code: 'LDG-BL', name: 'TP. Bảo Lộc' },
      { code: 'LDG-DT', name: 'Đạ Tẻh' },
      { code: 'LDG-DH', name: 'Đạ Huoai' },
      { code: 'LDG-CT', name: 'Cát Tiên' },
      { code: 'LDG-BLA', name: 'Bảo Lâm' },
      { code: 'LDG-DLI', name: 'Di Linh' },
      { code: 'LDG-DD', name: 'Đơn Dương' },
      { code: 'LDG-DT2', name: 'Đức Trọng' },
      { code: 'LDG-LD', name: 'Lạc Dương' },
      { code: 'LDG-LH', name: 'Lâm Hà' },
      // Bình Thuận
      { code: 'LDG-PT', name: 'TP. Phan Thiết (BT)' },
      { code: 'LDG-LG', name: 'TX. La Gi (BT)' },
      { code: 'LDG-BB', name: 'Bắc Bình (BT)' },
      { code: 'LDG-HTB', name: 'Hàm Thuận Bắc (BT)' },
      { code: 'LDG-HTN', name: 'Hàm Thuận Nam (BT)' },
      { code: 'LDG-HTA', name: 'Hàm Tân (BT)' },
      { code: 'LDG-PQ', name: 'Phú Quý (BT)' },
      { code: 'LDG-TL', name: 'Tánh Linh (BT)' },
      { code: 'LDG-DLU', name: 'Đức Linh (BT)' },
      { code: 'LDG-TP', name: 'Tuy Phong (BT)' },
      // Đắk Nông
      { code: 'LDG-GN', name: 'TP. Gia Nghĩa (ĐN)' },
      { code: 'LDG-CJ', name: 'Cư Jút (ĐN)' },
      { code: 'LDG-DM', name: 'Đắk Mil (ĐN)' },
      { code: 'LDG-DGG', name: 'Đắk Glong (ĐN)' },
      { code: 'LDG-DS', name: 'Đắk Song (ĐN)' },
      { code: 'LDG-DRL', name: "Đắk R'Lấp (ĐN)" },
      { code: 'LDG-KN', name: 'Krông Nô (ĐN)' },
      { code: 'LDG-TD', name: 'Tuy Đức (ĐN)' },
    ]
  },
  {
    code: 'DL', name: 'Đắk Lắk', // Giữ nguyên
    districts: [
      { code: 'DL-BMT', name: 'TP. Buôn Ma Thuột' },
      { code: 'DL-BH', name: 'TX. Buôn Hồ' },
      { code: 'DL-EH', name: "Ea H'leo" },
      { code: 'DL-EK', name: 'Ea Kar' },
      { code: 'DL-ES', name: 'Ea Súp' },
      { code: 'DL-BD', name: 'Buôn Đôn' },
      { code: 'DL-CK', name: 'Cư Kuin' },
      { code: 'DL-CM', name: "Cư M'gar" },
      { code: 'DL-KA', name: 'Krông Ana' },
      { code: 'DL-KB', name: 'Krông Bông' },
      { code: 'DL-KBU', name: 'Krông Búk' },
      { code: 'DL-KNA', name: 'Krông Năng' },
      { code: 'DL-LK', name: 'Lắk' },
      { code: 'DL-MD', name: "M'Drắk" },
    ]
  },
  {
    code: 'DNA', name: 'Đồng Nai', // Đồng Nai + Bình Phước
    districts: [
      { code: 'DNA-BH', name: 'TP. Biên Hòa' },
      { code: 'DNA-LK', name: 'TP. Long Khánh' },
      { code: 'DNA-NT', name: 'Nhơn Trạch' },
      { code: 'DNA-LT', name: 'Long Thành' },
      { code: 'DNA-VC', name: 'Vĩnh Cửu' },
      { code: 'DNA-TB', name: 'Trảng Bom' },
      { code: 'DNA-XL', name: 'Xuân Lộc' },
      { code: 'DNA-CM', name: 'Cẩm Mỹ' },
      { code: 'DNA-DQ', name: 'Định Quán' },
      { code: 'DNA-TP', name: 'Tân Phú' },
      // Bình Phước
      { code: 'DNA-DX', name: 'TP. Đồng Xoài (BP)' },
      { code: 'DNA-BL', name: 'TX. Bình Long (BP)' },
      { code: 'DNA-PL', name: 'TX. Phước Long (BP)' },
      { code: 'DNA-CT', name: 'Chơn Thành (BP)' },
      { code: 'DNA-DP', name: 'Đồng Phú (BP)' },
      { code: 'DNA-HQ', name: 'Hớn Quản (BP)' },
      { code: 'DNA-LN', name: 'Lộc Ninh (BP)' },
      { code: 'DNA-BDO', name: 'Bù Đốp (BP)' },
      { code: 'DNA-BGM', name: 'Bù Gia Mập (BP)' },
      { code: 'DNA-BDA', name: 'Bù Đăng (BP)' },
    ]
  },
  {
    code: 'TN2', name: 'Tây Ninh', // Tây Ninh + Long An
    districts: [
      { code: 'TN2-TN', name: 'TP. Tây Ninh' },
      { code: 'TN2-GD', name: 'Gò Dầu' },
      { code: 'TN2-BC', name: 'Bến Cầu' },
      { code: 'TN2-TB', name: 'Trảng Bàng' },
      { code: 'TN2-DM', name: 'Dương Minh Châu' },
      { code: 'TN2-HT', name: 'Hòa Thành' },
      { code: 'TN2-CT', name: 'Châu Thành' },
      { code: 'TN2-TNB', name: 'Tân Biên' },
      { code: 'TN2-TC', name: 'Tân Châu' },
      // Long An
      { code: 'TN2-TA', name: 'TP. Tân An (LA)' },
      { code: 'TN2-KT', name: 'TX. Kiến Tường (LA)' },
      { code: 'TN2-BL', name: 'Bến Lức (LA)' },
      { code: 'TN2-DH', name: 'Đức Hòa (LA)' },
      { code: 'TN2-DH2', name: 'Đức Huệ (LA)' },
      { code: 'TN2-MH', name: 'Mộc Hóa (LA)' },
      { code: 'TN2-VH', name: 'Vĩnh Hưng (LA)' },
      { code: 'TN2-TTH', name: 'Tân Thạnh (LA)' },
      { code: 'TN2-TTU', name: 'Thủ Thừa (LA)' },
      { code: 'TN2-CD', name: 'Cần Đước (LA)' },
      { code: 'TN2-CG', name: 'Cần Giuộc (LA)' },
      { code: 'TN2-CTA', name: 'Châu Thành (LA)' },
      { code: 'TN2-TH', name: 'Tân Hưng (LA)' },
      { code: 'TN2-TP', name: 'Tân Trụ (LA)' },
    ]
  },
  {
    code: 'VL', name: 'Vĩnh Long', // Vĩnh Long + Bến Tre + Trà Vinh
    districts: [
      { code: 'VL-VL', name: 'TP. Vĩnh Long' },
      { code: 'VL-BM', name: 'TX. Bình Minh' },
      { code: 'VL-LH', name: 'Long Hồ' },
      { code: 'VL-MT', name: 'Mang Thít' },
      { code: 'VL-VL2', name: 'Vũng Liêm' },
      { code: 'VL-TB', name: 'Tam Bình' },
      { code: 'VL-TO', name: 'Trà Ôn' },
      { code: 'VL-BT', name: 'Bình Tân' },
      // Bến Tre
      { code: 'VL-BTE', name: 'TP. Bến Tre' },
      { code: 'VL-CT', name: 'Châu Thành (BT)' },
      { code: 'VL-CL', name: 'Chợ Lách (BT)' },
      { code: 'VL-MB', name: 'Mỏ Cày Bắc (BT)' },
      { code: 'VL-MN', name: 'Mỏ Cày Nam (BT)' },
      { code: 'VL-GT', name: 'Giồng Trôm (BT)' },
      { code: 'VL-BD', name: 'Bình Đại (BT)' },
      { code: 'VL-BAT', name: 'Ba Tri (BT)' },
      { code: 'VL-TPH', name: 'Thạnh Phú (BT)' },
      // Trà Vinh
      { code: 'VL-TV', name: 'TP. Trà Vinh' },
      { code: 'VL-CTV', name: 'Châu Thành (TV)' },
      { code: 'VL-CK', name: 'Cầu Kè (TV)' },
      { code: 'VL-TC', name: 'Tiểu Cần (TV)' },
      { code: 'VL-CG', name: 'Càng Long (TV)' },
      { code: 'VL-DH', name: 'Duyên Hải (TV)' },
      { code: 'VL-TCU', name: 'Trà Cú (TV)' },
      { code: 'VL-CN', name: 'Cầu Ngang (TV)' },
    ]
  },
  {
    code: 'DT', name: 'Đồng Tháp', // Đồng Tháp + Tiền Giang
    districts: [
      { code: 'DT-CL', name: 'TP. Cao Lãnh' },
      { code: 'DT-SD', name: 'TP. Sa Đéc' },
      { code: 'DT-HN', name: 'TX. Hồng Ngự' },
      { code: 'DT-TH', name: 'Thanh Bình' },
      { code: 'DT-LV', name: 'Lấp Vò' },
      { code: 'DT-LVI', name: 'Lai Vung' },
      { code: 'DT-CT', name: 'Châu Thành' },
      { code: 'DT-CLA', name: 'Cao Lãnh (H)' },
      { code: 'DT-TN', name: 'Tân Hồng' },
      { code: 'DT-HNG', name: 'Hồng Ngự (H)' },
      { code: 'DT-TT', name: 'Tam Nông' },
      // Tiền Giang
      { code: 'DT-MT', name: 'TP. Mỹ Tho (TG)' },
      { code: 'DT-GC', name: 'TX. Gò Công (TG)' },
      { code: 'DT-CL2', name: 'TX. Cai Lậy (TG)' },
      { code: 'DT-CTG', name: 'Châu Thành (TG)' },
      { code: 'DT-CLH', name: 'Cai Lậy (H) (TG)' },
      { code: 'DT-CB', name: 'Cái Bè (TG)' },
      { code: 'DT-TP', name: 'Tân Phước (TG)' },
      { code: 'DT-GDE', name: 'Gò Công Đông (TG)' },
      { code: 'DT-GDW', name: 'Gò Công Tây (TG)' },
      { code: 'DT-CGA', name: 'Chợ Gạo (TG)' },
      { code: 'DT-TPD', name: 'Tân Phú Đông (TG)' },
    ]
  },
  {
    code: 'AG', name: 'An Giang', // An Giang + Kiên Giang
    districts: [
      { code: 'AG-LX', name: 'TP. Long Xuyên' },
      { code: 'AG-CD', name: 'TP. Châu Đốc' },
      { code: 'AG-AP', name: 'TX. An Phú' },
      { code: 'AG-TC', name: 'TX. Tân Châu' },
      { code: 'AG-CP', name: 'Châu Phú' },
      { code: 'AG-CT', name: 'Châu Thành' },
      { code: 'AG-CM', name: 'Chợ Mới' },
      { code: 'AG-PC', name: 'Phú Châu' },
      { code: 'AG-TS', name: 'Thoại Sơn' },
      // Kiên Giang
      { code: 'AG-RG', name: 'TP. Rạch Giá (KG)' },
      { code: 'AG-HT', name: 'TX. Hà Tiên (KG)' },
      { code: 'AG-PQ', name: 'TP. Phú Quốc (KG)' },
      { code: 'AG-CTK', name: 'Châu Thành (KG)' },
      { code: 'AG-GR', name: 'Giồng Riềng (KG)' },
      { code: 'AG-GQ', name: 'Gò Quao (KG)' },
      { code: 'AG-AB', name: 'An Biên (KG)' },
      { code: 'AG-AM', name: 'An Minh (KG)' },
      { code: 'AG-VT', name: 'Vĩnh Thuận (KG)' },
      { code: 'AG-UM', name: 'U Minh Thượng (KG)' },
      { code: 'AG-KL', name: 'Kiên Lương (KG)' },
      { code: 'AG-HD', name: 'Hòn Đất (KG)' },
      { code: 'AG-TH', name: 'Tân Hiệp (KG)' },
      { code: 'AG-GT', name: 'Giang Thành (KG)' },
    ]
  },
  {
    code: 'CM', name: 'Cà Mau', // Cà Mau + Bạc Liêu
    districts: [
      { code: 'CM-CM', name: 'TP. Cà Mau' },
      { code: 'CM-TB', name: 'Thới Bình' },
      { code: 'CM-UM', name: 'U Minh' },
      { code: 'CM-TVT', name: 'Trần Văn Thời' },
      { code: 'CM-CN', name: 'Cái Nước' },
      { code: 'CM-DD', name: 'Đầm Dơi' },
      { code: 'CM-NC', name: 'Năm Căn' },
      { code: 'CM-NH', name: 'Ngọc Hiển' },
      { code: 'CM-PT', name: 'Phú Tân' },
      // Bạc Liêu
      { code: 'CM-BL', name: 'TP. Bạc Liêu' },
      { code: 'CM-GR', name: 'Giá Rai (BL)' },
      { code: 'CM-HB', name: 'Hòa Bình (BL)' },
      { code: 'CM-PL', name: 'Phước Long (BL)' },
      { code: 'CM-HD', name: 'Hồng Dân (BL)' },
      { code: 'CM-VLI', name: 'Vĩnh Lợi (BL)' },
      { code: 'CM-DH', name: 'Đông Hải (BL)' },
    ]
  },
  {
    code: 'BG', name: 'Bắc Giang', // Bắc Giang + Lạng Sơn... (theo NQ riêng)
    districts: [
      { code: 'BG-BG', name: 'TP. Bắc Giang' },
      { code: 'BG-HH', name: 'Hiệp Hòa' },
      { code: 'BG-LG', name: 'Lạng Giang' },
      { code: 'BG-LN', name: 'Lục Nam' },
      { code: 'BG-LNG', name: 'Lục Ngạn' },
      { code: 'BG-SD', name: 'Sơn Động' },
      { code: 'BG-TY', name: 'Tân Yên' },
      { code: 'BG-VY', name: 'Việt Yên' },
      { code: 'BG-YD', name: 'Yên Dũng' },
      { code: 'BG-YT', name: 'Yên Thế' },
    ]
  },
]