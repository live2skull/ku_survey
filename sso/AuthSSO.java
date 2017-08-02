import java.io.UnsupportedEncodingException;
import java.util.Scanner;


import org.json.simple.JSONObject;
import SafeIdentity.*;

public class AuthSSO {
	public static String 	GID = "KOREA_UNIV";
	public static int 		TOKENVER = 3;
	
	public static void extractInfo(SSO sso, String[] keys)
	{
		for (String k : keys)
		{
			System.out.println(k + "-" + sso.getValue(k));
		}
	}
	
	public static void main(String[] args) throws UnsupportedEncodingException {
		
		String hostName = args[0];
		String port = args[1];
		
		String SSOAPI = args[2];
		String ssoSecurityToken = args[3];
		

		// #1 - SSO토큰 생성
		SSO sso = new SSO(SSOAPI);
		sso.setHostName(hostName);
		sso.setPortNumber(Integer.parseInt(port));

		// #2 - SSO토큰 검증
		int Result = -1;
		Result = sso.verifyToken(ssoSecurityToken);

		if(Result == 0){	// 보안토큰 검증 성공하여 보안토큰에서 정보 추출

			// 교수 로그인을 위해 일부 데이터 추가됨.
			String[] infos = {"USERNAME", "USERID", "DPTNM", "DEPTCD", "USERIDLIST", "GROUPNMLIST", "UID",
			"DPTNMLIST"};
			extractInfo(sso, infos);
			
		} else {
			//return -1;
		}
	}
}
