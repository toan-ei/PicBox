'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Search, X, MapPin } from 'lucide-react'
import { VIETNAM_PROVINCES, type Province, type District } from '@/lib/vietnam-locations'

// ── Chuẩn hoá tiếng Việt để search không phân biệt dấu ──────────────
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // bỏ dấu thanh
    .replace(/đ/g, 'd')                // đ → d
    .replace(/[.\-_,()]/g, ' ')        // "TP.H" → "TP H", "TP. Hà" → "TP  Ha"
    .replace(/\s+/g, ' ')              // nhiều space → 1
    .trim()
}

// ── Alias viết tắt phổ biến ──────────────────────────────────────────
const ALIASES: Record<string, string> = {
  'hcm': 'ho chi minh',
  'tphcm': 'tp ho chi minh',
  'hcmc': 'ho chi minh',
  'sgn': 'ho chi minh',
  'hn': 'ha noi',
  'tphn': 'tp ha noi',
  'dn': 'da nang',
  'ct': 'can tho',
  'hp': 'hai phong',
  'hue': 'hue',
}

function expandAlias(query: string): string {
  const norm = normalize(query).replace(/\s/g, '')   // "tphcm" không có space
  return ALIASES[norm] ?? normalize(query)
}
interface SelectProps {
  label: string
  placeholder: string
  options: { code: string; name: string }[]
  value: string
  onChange: (code: string, name: string) => void
  disabled?: boolean
  required?: boolean
}

function SearchableSelect({
  label, placeholder, options, value, onChange, disabled, required
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Tách query thành từng từ, tất cả phải xuất hiện trong tên
  // VD: "tp h" → ["tp", "h"] → "tp. hồ chí minh" chứa cả "tp" và "h" → match
  const expandedQuery = expandAlias(search)
  const queryWords = expandedQuery.split(' ').filter(Boolean)
  const filtered = options.filter(o => {
    if (queryWords.length === 0) return true
    const normName = normalize(o.name)
    return queryWords.every(word => normName.includes(word))
  })

  const selected = options.find(o => o.code === value)

  // Đóng khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus vào input khi mở
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const handleToggle = () => {
    if (disabled) return
    setOpen(prev => !prev)
    setSearch('')
  }

  const handleSelect = (code: string, name: string) => {
    onChange(code, name)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={[
          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left transition-all border',
          disabled
            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            : open
            ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
            : 'border-gray-200 hover:border-gray-400 bg-white',
        ].join(' ')}
      >
        <span className={selected ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-[60] mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search bar */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Tìm ${label.toLowerCase()}...`}
                className="w-full pl-7 pr-7 py-1.5 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100
                  text-gray-900 bg-white placeholder-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 rounded"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Option list */}
          <div className="max-h-56 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-sm text-gray-400 gap-1.5">
                <Search size={20} className="text-gray-300" />
                <span>Không tìm thấy "{search}"</span>
              </div>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code, opt.name)}
                  className={[
                    'w-full text-left px-3.5 py-2.5 text-sm transition-colors',
                    value === opt.code
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50',
                  ].join(' ')}
                >
                  {/* Highlight từ khớp */}
                  <HighlightMatch text={opt.name} query={search} />
                </button>
              ))
            )}
          </div>

          {/* Footer count */}
          {search && filtered.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 text-xs text-gray-400 bg-gray-50">
              {filtered.length} kết quả
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Highlight chữ khớp trong kết quả ────────────────────────────────
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const normQuery = normalize(query)
  const normText = normalize(text)
  const idx = normText.indexOf(normQuery)

  if (idx === -1) return <>{text}</>

  // Tìm vị trí tương ứng trong chuỗi gốc (có dấu)
  // Vì chuẩn hoá có thể thay đổi độ dài, dùng cách đơn giản:
  // tìm bằng regex case-insensitive trên chuỗi gốc
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-yellow-100 text-yellow-900 font-semibold rounded px-0.5 not-italic">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

// ── LocationSelector chính ───────────────────────────────────────────
export interface LocationValue {
  provinceCode: string
  provinceName: string
  districtCode: string
  districtName: string
  ward: string
  address: string
}

interface LocationSelectorProps {
  value: LocationValue
  onChange: (val: LocationValue) => void
  errors?: {
    province?: string
    district?: string
    address?: string
  }
}

export default function LocationSelector({ value, onChange, errors }: LocationSelectorProps) {
  // Lấy danh sách quận/huyện theo tỉnh đã chọn
  const selectedProvince = VIETNAM_PROVINCES.find(p => p.code === value.provinceCode)
  const districtOptions = selectedProvince?.districts ?? []

  const handleProvinceChange = (code: string, name: string) => {
    // Reset quận/huyện khi đổi tỉnh
    onChange({
      ...value,
      provinceCode: code,
      provinceName: name,
      districtCode: '',
      districtName: '',
      ward: '',
    })
  }

  const handleDistrictChange = (code: string, name: string) => {
    onChange({ ...value, districtCode: code, districtName: name })
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tỉnh / Thành phố */}
      <div>
        <SearchableSelect
          label="Tỉnh / Thành phố"
          placeholder="Chọn tỉnh / thành phố"
          options={VIETNAM_PROVINCES}
          value={value.provinceCode}
          onChange={handleProvinceChange}
          required
        />
        {errors?.province && (
          <p className="mt-1 text-xs text-red-500">{errors.province}</p>
        )}
      </div>

      {/* Quận / Huyện */}
      <div>
        <SearchableSelect
          label="Quận / Huyện"
          placeholder={value.provinceCode ? 'Chọn quận / huyện' : 'Chọn tỉnh/thành trước'}
          options={districtOptions}
          value={value.districtCode}
          onChange={handleDistrictChange}
          disabled={!value.provinceCode}
          required
        />
        {errors?.district && (
          <p className="mt-1 text-xs text-red-500">{errors.district}</p>
        )}
      </div>

      {/* Phường / Xã — text input */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          Phường / Xã
        </label>
        <input
          type="text"
          placeholder="Nhập tên phường / xã..."
          value={value.ward}
          onChange={e => onChange({ ...value, ward: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Địa chỉ cụ thể */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
          Địa chỉ cụ thể <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Số nhà, tên đường..."
            value={value.address}
            onChange={e => onChange({ ...value, address: e.target.value })}
            className="w-full pl-8 pr-3 border border-gray-200 rounded-lg py-2.5 text-sm text-gray-900
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {errors?.address && (
          <p className="mt-1 text-xs text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Preview địa chỉ đầy đủ */}
      {(value.address || value.districtName || value.provinceName) && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
          <MapPin size={13} className="mt-0.5 shrink-0 text-blue-400" />
          <span className="leading-relaxed">
            {[value.address, value.ward, value.districtName, value.provinceName]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )}
    </div>
  )
}