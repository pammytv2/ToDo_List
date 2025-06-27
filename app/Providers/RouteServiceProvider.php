<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));

        // ถ้าคุณอยากให้ web.php ยังใช้งานได้อยู่ด้วย
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}
