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
		

		// #1 - SSO��ū ����
		SSO sso = new SSO(SSOAPI);
		sso.setHostName(hostName);
		sso.setPortNumber(Integer.parseInt(port));

		// #2 - SSO��ū ����
		int Result = -1;
		Result = sso.verifyToken(ssoSecurityToken);

		if(Result == 0){	// ������ū ���� �����Ͽ� ������ū���� ���� ����

			// ���� �α����� ���� �Ϻ� ������ �߰���.
			String[] infos = {"USERNAME", "USERID", "DPTNM", "DEPTCD", "USERIDLIST", "GROUPNMLIST", "UID",
			"DPTNMLIST"};
			extractInfo(sso, infos);
			
		} else {
			//return -1;
		}
	}
}
