'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Building2 } from 'lucide-react';

interface PasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function PasswordDialog({ isOpen, onClose, onSubmit, isLoading, error }: PasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Debug logging
  console.log('PasswordDialog render:', { isOpen, isLoading, error });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Save password to localStorage for later reference
    localStorage.setItem('erpnext_password', password);
    
    await onSubmit(password);
  };

  const handleClose = () => {
    if (!isLoading) {
      setPassword('');
      setConfirmPassword('');
      setValidationError('');
      onClose();
    }
  };

  // Temporary test - simple div instead of Dialog
  if (!isOpen) {
    console.log('PasswordDialog: isOpen is false, not rendering');
    return null;
  }

  console.log('PasswordDialog: isOpen is true, rendering dialog');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle>Create Your Business Platform</DialogTitle>
              <DialogDescription>
                Set up your personal business suite
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Info Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">What you'll get:</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Complete CRM & Sales Management</li>
              <li>• HR & Employee Management</li>
              <li>• Accounting & Financial Reports</li>
              <li>• Project & Task Management</li>
              <li>• Inventory & Warehouse Management</li>
              <li>• Customer Support System</li>
            </ul>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a secure password"
                  className="pr-10"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* Error Messages */}
            {(validationError || error) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {validationError || error}
                </AlertDescription>
              </Alert>
            )}

            {/* Setup Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Setup time:</strong> 3-5 minutes. You'll receive an email when your platform is ready.
              </p>
            </div>

            {/* Security Disclaimer */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>⚠️ Important:</strong> Your password will be saved securely for your convenience. 
                However, <strong>we cannot recover it if lost</strong> - please store it safely or use a password manager.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Platform...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Create My Platform
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
