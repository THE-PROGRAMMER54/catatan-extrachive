<?php

namespace App\Http\Controllers;

use App\Models\catatan;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class catatancontroller extends Controller
{
    public function index(){
        try{

            JWTAuth::parseToken()->authenticate();
            $data = catatan::all();
            return response()->json(["data" => $data]);

        }catch(Exception $e){

            return response()->json(["error" => "gagal","massage" => $e->getMessage()]);

        }
    }

    public function addcatatan(Request $request){
        try{
            $user = JWTAuth::parseToken()->authenticate();
            $request->validate([
                "judul" => "required|min:5|string",
                "catatan" => "string|min:10|required"
            ]);

            $data = catatan::where("user_id" , $user->id)->where("judul", $request->judul)->first();

            if(!$data){

                    $catat = new catatan;
                    $catat->user_id = $user->id;
                    $catat->judul = $request->judul;
                    $catat->catatan = $request->catatan;
                    $catat->save();
                    return response()->json(["success" => "data berhasil di tambahkan"],200);

            }else{

                return response()->json(["error" => "data sudah ada"],409);

            }
        }catch(Exception $e){

            return response()->json(["error" => "not error","message" => $e],500);

        }
    }
}
