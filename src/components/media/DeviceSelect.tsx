import { CaretDown } from "@phosphor-icons/react/dist/ssr";

type Props = { label: string; devices: MediaDeviceInfo[]; value: string; onChange: (value: string) => void; disabled?: boolean };

export function DeviceSelect({ label, devices, value, onChange, disabled }: Props) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      <span className="relative block">
        <select value={value} disabled={disabled || devices.length < 2} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none truncate rounded-xl border border-line bg-white px-3 pr-9 text-sm text-ink outline-none transition focus:border-ink/30 focus:ring-4 focus:ring-ink/5 disabled:text-muted">
          {devices.length === 0 && <option value="">No device found</option>}
          {devices.map((device, index) => <option value={device.deviceId} key={device.deviceId || index}>{device.label || `${label} ${index + 1}`}</option>)}
        </select>
        <CaretDown className="pointer-events-none absolute right-3 top-3.5 text-muted" size={15} />
      </span>
    </label>
  );
}
