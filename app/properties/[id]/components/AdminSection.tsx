import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, TextField, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { FaLock, FaTrash, FaClipboard, FaExclamationTriangle, FaCalendarAlt, FaFileExport, FaCog, FaKey, FaWifi, FaFileUpload } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useProperty } from '../contexts/PropertyContext';
import { Property, Booking, PasscodeHistory } from '../types';
import { SelectChangeEvent } from '@mui/material/Select';

interface AdminSectionProps {
  property: Property;
  isAdmin: boolean;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onRegenerateToken: () => Promise<void>;
  closedDays: string | string[];
  cleaningTime: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => void;
  wifiSSID: string;
  wifiPassword: string;
  attachedFiles: AttachedFile[];
  onFileUpload: (file: File) => Promise<void>;
  onFileDelete: (fileName: string) => Promise<void>;
}

interface ExportOptions {
  withEvents: boolean;
  withoutEvents: boolean;
  withPersonalInfo: boolean;
  withoutPersonalInfo: boolean;
  hashKey?: string;
}

interface LockSystem {
  name: string;
  apiKey: string;
}

interface AttachedFile {
  name: string;
  url: string;
}

const getInitialDate = (value: any): string => {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'string') {
    return value;
  }
  return '';
};

const AdminSection: React.FC<AdminSectionProps> = ({
  property,
  isAdmin,
  onDeleteBooking,
  onRegenerateToken,
  closedDays,
  cleaningTime,
  onInputChange,
  wifiSSID,
  wifiPassword,
  attachedFiles,
  onFileUpload,
  onFileDelete
}) => {
  const { isEditing, updateProperty } = useProperty();
  const [icalUrls, setIcalUrls] = useState<string[]>(property.icalUrls || []);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    withEvents: true,
    withoutEvents: false,
    withPersonalInfo: false,
    withoutPersonalInfo: true,
    hashKey: '',
  });

  // New state
  const [minStayDays, setMinStayDays] = useState(property.minStayDays || 1);
  const [maxStayDays, setMaxStayDays] = useState(property.maxStayDays || 30);
  const [checkInTime, setCheckInTime] = useState(property.checkInTime || '15:00');
  const [checkOutTime, setCheckOutTime] = useState(property.checkOutTime || '11:00');

  const [sesameApiKey, setSesameApiKey] = useState(property.sesameApiKey || '');
  const [lockSystems, setLockSystems] = useState<LockSystem[]>(property.lockSystems || []);
  const [currentPasscode, setCurrentPasscode] = useState(property.currentPasscode || '');
  const [passcodeHistory, setPasscodeHistory] = useState<PasscodeHistory[]>(property.passcodeHistory || []);
  const [passcodeType, setPasscodeType] = useState<'physical' | 'digital'>('physical');

  // Wi-Fi情報用の状態を追加
  const [showWifiInfo, setShowWifiInfo] = useState(false);

  const [closedDaysArray, setClosedDaysArray] = useState<string[]>(
    Array.isArray(closedDays) ? closedDays : (closedDays as string).split(', ').filter(Boolean)
  );

  const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];

  const [availableFrom, setAvailableFrom] = useState<string>('');
  const [availableTo, setAvailableTo] = useState<string>('');

  useEffect(() => {
    setAvailableFrom(getInitialDate(property.availableFrom));
    setAvailableTo(getInitialDate(property.availableTo));
  }, [property.availableFrom, property.availableTo]);

  const handleClosedDaysChange = (event: SelectChangeEvent<typeof closedDaysArray>) => {
    const selectedDays = event.target.value as string[];
    setClosedDaysArray(selectedDays);
    onInputChange({ target: { name: 'closedDays', value: selectedDays.join(', ') } });
  };

  if (!isEditing) return null;

  const handleIcalUrlChange = (index: number, value: string) => {
    const newUrls = [...icalUrls];
    newUrls[index] = value;
    setIcalUrls(newUrls);
    updateProperty({ icalUrls: newUrls });
  };

  const handleAddIcalUrl = () => {
    const newUrls = [...icalUrls, ''];
    setIcalUrls(newUrls);
    updateProperty({ icalUrls: newUrls });
  };

  const handleRemoveIcalUrl = (index: number) => {
    const newUrls = icalUrls.filter((_, i) => i !== index);
    setIcalUrls(newUrls);
    updateProperty({ icalUrls: newUrls });
  };

  const handleExportOptionChange = (option: keyof ExportOptions) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportOptions({ ...exportOptions, [option]: event.target.checked });
  };

  const handleHashKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExportOptions({ ...exportOptions, hashKey: event.target.value });
  };

  const handleExport = () => {
    // ここでエクスポート処理を実行します
    console.log('Exporting iCal with options:', exportOptions);
    setExportDialogOpen(false);
  };

  const handleMinStayDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinStayDays(Number(event.target.value));
  };

  const handleMaxStayDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxStayDays(Number(event.target.value));
  };

  const handleCheckInTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckInTime(event.target.value);
  };

  const handleCheckOutTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOutTime(event.target.value);
  };

  const handleSesameApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSesameApiKey(event.target.value);
  };

  const handleLockSystemChange = (index: number, field: 'name' | 'apiKey', value: string) => {
    const newLockSystems = [...lockSystems];
    newLockSystems[index][field] = value;
    setLockSystems(newLockSystems);
  };

  const handleAddLockSystem = () => {
    setLockSystems([...lockSystems, { name: '', apiKey: '' }]);
  };

  const handleRemoveLockSystem = (index: number) => {
    const newLockSystems = lockSystems.filter((_, i) => i !== index);
    setLockSystems(newLockSystems);
  };

  const handlePasscodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPasscode(event.target.value);
  };

  const handlePasscodeTypeChange = (event: SelectChangeEvent<'physical' | 'digital'>) => {
    setPasscodeType(event.target.value as 'physical' | 'digital');
  };

  const handlePasscodeUpdate = () => {
    const newHistory: PasscodeHistory = {
      passcode: currentPasscode,
      type: passcodeType,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Current User', // 実際のユーザー情報に置き換えてください
    };
    setPasscodeHistory([newHistory, ...passcodeHistory]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  const handleAvailableFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailableFrom(event.target.value);
    onInputChange({ target: { name: 'availableFrom', value: event.target.value } });
  };

  const handleAvailableToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvailableTo(event.target.value);
    onInputChange({ target: { name: 'availableTo', value: event.target.value } });
  };

  return (
    <section className="mb-8 bg-gray-100 p-6 rounded-lg">
      <Typography variant="h4" className="mb-4 font-semibold text-gray-800 flex items-center">
        <FaLock className="mr-2 text-indigo-600" /> 管理者専用セクション
      </Typography>

      <Paper className="p-4 bg-white shadow-md mb-4">
        <Typography variant="h5" className="mb-2 font-semibold">予約済みゲスト一覧</Typography>
        {property.bookings && property.bookings.length > 0 ? (
          <ul>
            {property.bookings.map((booking) => (
              <li key={booking.id} className="mb-2 flex justify-between items-center">
                <Typography>
                  {booking.guestName} ({booking.guestEmail}) - 
                  {new Date(booking.startDate.seconds * 1000).toLocaleDateString('ja-JP')} から
                  {new Date(booking.endDate.seconds * 1000).toLocaleDateString('ja-JP')} まで
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => onDeleteBooking(booking.id)}
                  startIcon={<FaTrash />}
                >
                  削除
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <Typography>予約はありません。</Typography>
        )}
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-2 font-semibold">iCal インポート設定</Typography>
        <Typography variant="body2" className="mb-4">
          以下のURLを設定することで、外部カレンダーの予定が自動的にブロックされます。
          10分おき更新され、ダブルブッキングを防止します。
        </Typography>
        {icalUrls.map((url, index) => (
          <div key={index} className="flex items-center mb-2">
            <TextField
              fullWidth
              value={url}
              onChange={(e) => handleIcalUrlChange(index, e.target.value)}
              label={`iCal URL ${index + 1}`}
              variant="outlined"
              size="small"
              className="mr-2"
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveIcalUrl(index)}
              startIcon={<MdDelete />}
            >
              削除
            </Button>
          </div>
        ))}
        <Button onClick={handleAddIcalUrl} variant="outlined" color="primary" className="mt-2">
          URLを追加
        </Button>
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-4 font-semibold flex items-center">
          <FaCog className="mr-2 text-indigo-600" /> 宿泊設定
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="最小宿泊日数"
            type="number"
            value={minStayDays}
            onChange={handleMinStayDaysChange}
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            label="最大宿泊日数"
            type="number"
            value={maxStayDays}
            onChange={handleMaxStayDaysChange}
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            label="チェックイン時間"
            type="time"
            value={checkInTime}
            onChange={handleCheckInTimeChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="チェックアウト時間"
            type="time"
            value={checkOutTime}
            onChange={handleCheckOutTimeChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-4 font-semibold flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-600" /> 利用可能期間
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="利用開始日"
            type="date"
            value={availableFrom}
            onChange={handleAvailableFromChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="利用終了日"
            type="date"
            value={availableTo}
            onChange={handleAvailableToChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-4 font-semibold flex items-center">
          <FaCalendarAlt className="mr-2 text-indigo-600" /> 休業日と清掃時間
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel>休業日</InputLabel>
            <Select
              multiple
              value={closedDaysArray}
              onChange={handleClosedDaysChange}
              renderValue={(selected) => (
                <div className="flex flex-wrap gap-1">
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="清掃時間"
            name="cleaningTime"
            value={cleaningTime}
            onChange={onInputChange}
            variant="outlined"
            type="time"
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-2 font-semibold">iCal エクスポート</Typography>
        <Button
          onClick={() => setExportDialogOpen(true)}
          variant="contained"
          color="primary"
          startIcon={<FaFileExport />}
          className="mt-2"
        >
          iCalをエクスポート
        </Button>
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-4 font-semibold flex items-center">
          <FaKey className="mr-2 text-indigo-600" /> 鍵情報
        </Typography>
        
        <TextField
          fullWidth
          label="セサミロック API キー"
          value={sesameApiKey}
          onChange={handleSesameApiKeyChange}
          variant="outlined"
          className="mb-4"
        />

        <Typography variant="h6" className="mb-2">その他のロックシステム</Typography>
        {lockSystems.map((system, index) => (
          <div key={index} className="flex items-center mb-2">
            <TextField
              label="システム名"
              value={system.name}
              onChange={(e) => handleLockSystemChange(index, 'name', e.target.value)}
              variant="outlined"
              size="small"
              className="mr-2"
            />
            <TextField
              label="API キー"
              value={system.apiKey}
              onChange={(e) => handleLockSystemChange(index, 'apiKey', e.target.value)}
              variant="outlined"
              size="small"
              className="mr-2"
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveLockSystem(index)}
              startIcon={<MdDelete />}
            >
              削除
            </Button>
          </div>
        ))}
        <Button onClick={handleAddLockSystem} variant="outlined" color="primary" className="mt-2">
          ロックシステムを追加
        </Button>

        <Typography variant="h6" className="mt-4 mb-2">パスコード管理</Typography>
        <div className="flex items-center mb-4">
          <FormControl variant="outlined" size="small" className="mr-2">
            <InputLabel>キータイプ</InputLabel>
            <Select
              value={passcodeType}
              onChange={handlePasscodeTypeChange}
              label="キータイプ"
            >
              <MenuItem value="physical">物理キー</MenuItem>
              <MenuItem value="digital">デジタルキー</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="パスコード"
            value={currentPasscode}
            onChange={handlePasscodeChange}
            variant="outlined"
            size="small"
            className="mr-2"
          />
          <Button onClick={handlePasscodeUpdate} variant="contained" color="primary">
            パスコードを更新
          </Button>
        </div>

        <Typography variant="h6" className="mb-2">パスコード履歴</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>パスコード</TableCell>
                <TableCell>キータイプ</TableCell>
                <TableCell>更新日時</TableCell>
                <TableCell>更新者</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passcodeHistory.map((history, index) => (
                <TableRow key={index}>
                  <TableCell>{history.passcode}</TableCell>
                  <TableCell>{history.type === 'physical' ? '物理キー' : 'デジタルキー'}</TableCell>
                  <TableCell>{new Date(history.updatedAt).toLocaleString('ja-JP')}</TableCell>
                  <TableCell>{history.updatedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-4 font-semibold flex items-center">
          <FaWifi className="mr-2 text-indigo-600" /> Wi-Fi情報
        </Typography>
        <Typography variant="body2" className="mb-2">
          この情報は会員登録して予約したゲストのみに表示されます。
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            label="Wi-Fi SSID"
            name="wifiSSID"
            value={wifiSSID}
            onChange={onInputChange}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Wi-Fiパスワード"
            name="wifiPassword"
            value={wifiPassword}
            onChange={onInputChange}
            variant="outlined"
            type={showWifiInfo ? "text" : "password"}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={showWifiInfo}
              onChange={(e) => setShowWifiInfo(e.target.checked)}
            />
          }
          label="Wi-Fi情報を表示"
        />
      </Paper>

      <Paper className="p-4 bg-white shadow-md mt-4">
        <Typography variant="h5" className="mb-4 font-semibold flex items-center">
          <FaFileUpload className="mr-2 text-indigo-600" /> 関連ファイル
        </Typography>
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<FaFileUpload />}
          >
            ファイルをアップロード
          </Button>
        </label>
        {attachedFiles.length > 0 && (
          <TableContainer className="mt-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ファイル名</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attachedFiles.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        表示
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => onFileDelete(file.name)}
                        className="ml-2"
                      >
                        削除
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>iCalエクスポート設定</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={exportOptions.withEvents} onChange={handleExportOptionChange('withEvents')} />}
            label="予定ありのスケジュール"
          />
          <FormControlLabel
            control={<Checkbox checked={exportOptions.withoutEvents} onChange={handleExportOptionChange('withoutEvents')} />}
            label="予定なしのスケジュール"
          />
          <FormControlLabel
            control={<Checkbox checked={exportOptions.withPersonalInfo} onChange={handleExportOptionChange('withPersonalInfo')} />}
            label="個人情報を含むスケジュール"
          />
          <FormControlLabel
            control={<Checkbox checked={exportOptions.withoutPersonalInfo} onChange={handleExportOptionChange('withoutPersonalInfo')} />}
            label="個人情報を含まないスケジュー"
          />
          {exportOptions.withPersonalInfo && (
            <TextField
              fullWidth
              value={exportOptions.hashKey}
              onChange={handleHashKeyChange}
              label="ハッシュキー"
              variant="outlined"
              size="small"
              className="mt-2"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleExport} color="primary">エクスポート</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default AdminSection;