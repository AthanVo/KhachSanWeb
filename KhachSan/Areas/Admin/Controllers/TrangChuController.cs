using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KhachSan.Data;

namespace KhachSan.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class TrangChuController : Controller
    {
        private readonly ApplicationDBContext _context;

        public TrangChuController(ApplicationDBContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Quản trị")]
        public IActionResult Index()
        {
            ViewData["SoLuongPhong"] = _context.Phong.Count();
            ViewData["SoLuongDatPhong"] = _context.DatPhong.Count();
            ViewData["SoLuongLoaiPhong"] = _context.LoaiPhong.Count();
            ViewData["SoLuongDichVu"] = _context.DichVu.Count();

            return View();
        }
    }
}