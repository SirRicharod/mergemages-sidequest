<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetWeeklyXp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'xp:reset-weekly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset all users XP balance to their weekly allowance';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Resetting weekly XP for all users...');

        // Reset all users' xp_balance to their weekly_xp_allowance
        $affectedRows = DB::table('users')
            ->update([
                'xp_balance' => DB::raw('weekly_xp_allowance'),
                'updated_at' => now()
            ]);

        $this->info("Successfully reset XP for {$affectedRows} users.");
        
        return Command::SUCCESS;
    }
}
